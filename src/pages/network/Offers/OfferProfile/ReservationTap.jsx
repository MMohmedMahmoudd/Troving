import { useMemo, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@/components';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
const ReservationTap = ({ offerId }) => {
  if (!offerId) return <div>No offer selected.</div>;

  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [refetchKey] = useState(0);
  const navigate = useNavigate();
  const fetchReservations = async ({ pageIndex, pageSize, sorting }) => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem(
        import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION
      ))?.access_token;

      const sort = sorting?.[0]?.id;
      const url = `${import.meta.env.VITE_APP_API_URL}/reservations/list` +
        `?perPage=${pageSize}&page=${pageIndex + 1}` +
        (sort ? `&sort=${sort}` : '') +
        `&filter[offer_uid]=${offerId}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data?.data ?? [];
      const total = res.data?.pagination?.total ?? 0;

      return { data, totalCount: total };
    } catch (err) {
      console.error('Error fetching reservations:', err);
      return { data: [], totalCount: 0 };
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };


  const columns = useMemo(() => [
    {
      id: 'booking_uid',
      header: 'ID',
      accessorKey: 'booking_uid',
      cell: ({ row }) => (
        <span className="text-sm font-medium">{row.original.booking_uid}</span>
      ),
      enableSorting: true,
    },
    {
      id: 'customer',
      header: 'Customer',
      accessorKey: 'person_name',
      cell: ({ row }) => {
        const { person_name, person_image } = row.original;
        return (
          <div className="flex items-center gap-3">
            <img src={person_image || '/media/avatars/blank.png'}
             alt={person_name} 
             className="w-9 h-9 rounded-full object-cover" 
             onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/media/avatars/blank.png';
            }}
            />
            <div className="text-sm font-medium">{person_name}</div>
          </div>
        );
      },
      enableSorting: true,
      meta: { className: 'min-w-[180px]' },
    },
    {
      id:"price",
      header:"Price",
      accessorKey:"price",
      accessorFn: row => row.offer_price + ' ' + row.currency_name,
      enableSorting:true,
      
    }
    ,
    {
      id: 'num_coupons',
      header: 'Coupons',
      accessorKey: 'num_coupons',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.num_coupons}</span>
      ),
      meta: { className: 'min-w-[100px]' },
      enableSorting: true,
    },

    {
      id: 'booking_date',
      header: 'Reservation Date',
      accessorKey: 'booking_date',
      cell: ({ row }) => {
        const date = new Date(row.original.booking_date);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      },
      enableSorting: true,
      meta: { className: 'min-w-[150px]' },
    },
    {
      id: 'order_date',
      header: 'Order Date',
      accessorKey: 'order_date',
      enableSorting: true,
      cell:({row})=>{
        return <span className="text-sm">{row.original.order_date}</span>
      },
      meta: { className: 'min-w-[150px]' },
    },
    {
      id: 'coupons.expire_date',
      header: 'Coupons Expired',
      accessorKey: 'coupons.expire_date',
      cell: ({ row }) => {
        const firstCoupon = row.original.coupons && row.original.coupons.length > 0 ? row.original.coupons[0] : null;
        if (!firstCoupon || !firstCoupon.expire_date) return "-";
        const date = new Date(firstCoupon.expire_date);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      },
      enableSorting: true,
      meta: { className: 'min-w-[160px]' },
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status_name',
      cell: ({ row }) => (
        <span className={`badge badge-${row.original.status_name === 'Waiting Payment' ? 'warning' : row.original.status_name === 'confirmed' ? 'success' : row.original.status_name === 'cancelled' ? 'danger' : row.original.status_name === 'expired' ? 'danger' : row.original.status_name === 'completed' ? 'success' : 'danger'} badge-outline capitalize`}>
          ● {row.original.status_name}
        </span>
      ),
      meta: { className: 'min-w-[120px]' },
      enableSorting: true,
    },

    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => (
        <button
          className="px-2 py-1 btn btn-sm btn-outline btn-primary"
          onClick={() => navigate(`/reservationprofile/${row.original.booking_uid}`, { state: { reservation: row.original } })}
        >
          <i className="ki-filled ki-notepad-edit"></i>
        </button>
      ),
    }
  ], []);

  return (
    <div className="card-body p-0 overflow-x-auto relative">
      <DataGrid
        key={refetchKey}
        columns={columns}
        serverSide
        onFetchData={fetchReservations}
        isLoading={loading}
        layout={{
          cellsBorder: true,
          tableSpacing: 'sm',
        }}
        pagination={{
          page: pageIndex,
          size: pageSize,
          onPageChange: setPageIndex,
          onPageSizeChange: setPageSize,
        }}
        messages={{
          empty: 'No reservations available',
          loading: 'Loading reservations...'
        }}
      />
      {loading && (
        <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center">
          <div className="flex items-center gap-2 px-4 py-2 dark:bg-black/50 bg-white/90 rounded-lg shadow-lg">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-700">Loading reservations...</span>
          </div>
        </div>
      )}
    </div>
  );
};

ReservationTap.propTypes = {
  offerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export { ReservationTap };
