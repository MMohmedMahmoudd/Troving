import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { DataGrid, KeenIcon } from '@/components';
import { useNavigate } from 'react-router-dom';
import { DateRangeFilter } from '@/components';
const Teams = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400); // debounce delay
  
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const columns = useMemo(() => [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'booking_uid',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-sm font-medium">{row.original.booking_uid}</div>
      ),
    },
    {
      enableSorting: true,
      header: 'Person',
      accessorKey: 'person_name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
      <img
        loading="lazy"
        src={row.original.person_image || '/media/avatars/blank.png'}
        alt={row.original.person_name}
        className="w-8 h-8 rounded-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/media/avatars/blank.png';
        }}
      />
          <span className="font-medium">{row.original.person_name}</span>
        </div>
      ),
    },
    {
      enableSorting: true,
      header: 'Offer Title',
      accessorKey: 'offer_title',
    },
    {
      enableSorting: true,
      header: 'Quantity',
      accessorKey: 'num_coupons',
    },
    {
      enableSorting: true,
      header: 'Price',
      accessorKey: 'offer_price',
    },
    {
      enableSorting: true,
      header: 'Reservation Date',
      accessorKey: 'order_date',
      cell: ({ getValue }) => {
        const date = new Date(getValue());
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      },
    },
    {
      enableSorting: true,
      header: 'Status',
      accessorKey: 'status_name',
      cell: ({ row }) => (
        <span className="badge  badge-warning badge-outline">
        ● {row.original.status_name}
        </span>
      ),
      meta: {className: 'min-w-[150px]'},
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => (
        <button
          className="px-2 py-1"
          onClick={() => navigate(`/reservationprofile/${row.original.booking_uid}`, { state: { reservation: row.original } })}
        >
          <i className="ki-filled ki-notepad-edit"></i>
        </button>
      ),
    },
  ], []);

  const fetchBookings = async ({ pageIndex, pageSize, sorting }) => {
    try {
      setLoading(true);
  
      const storedAuth = localStorage.getItem(import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION);
      const authData = storedAuth ? JSON.parse(storedAuth) : null;
      const token = authData?.access_token;
      if (!token) {
        window.location.href = '/auth/login';
        return { data: [], totalCount: 0 };
      }
  
      const sortKey = sorting?.[0]?.id ?? 'offer.offer_price';
      const sortDir = sorting?.[0]?.desc ? '-' : '';
  
      const baseFilters = [
        fromDate ? `&filter[from_booking_date]=${fromDate}` : '',
        toDate ? `&filter[to_booking_date]=${toDate}` : '',
        searchStatus ? `&filter[booking_status]=${encodeURIComponent(searchStatus)}` : '',
      ].join('');
  
      const baseUrl = `${import.meta.env.VITE_APP_API_URL}/reservations/list?sort=${sortDir}${sortKey}&perPage=${pageSize}&page=${pageIndex + 1}${baseFilters}`;
  
      let url = baseUrl;
  
      if (debouncedSearch) {
        const isBookingUid = debouncedSearch.startsWith('RES') || /^\d+$/.test(debouncedSearch);
        if (isBookingUid) {
          url += `&filter[booking_uid]=${debouncedSearch}`;
        } else {
          url += `&filter[offer_title]=${debouncedSearch}`;
        }
      }
  
      // First API try
      let response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      let bookings = response?.data?.data ?? [];
      let total = response?.data?.pagination?.total ?? 0;
  
      // Smart Retry Logic:
      if (debouncedSearch && !bookings.length) {
        let retryUrl = baseUrl + `&filter[person_name]=${debouncedSearch}`;
  
        const retryResponse = await axios.get(retryUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        bookings = retryResponse?.data?.data ?? [];
        total = retryResponse?.data?.pagination?.total ?? 0;
      }
  
      setTotalCount(total);
      return { data: bookings, totalCount: total };
    } catch (err) {
      console.error('❌ Error fetching bookings:', err);
      return { data: [], totalCount: 0 };
    } finally {
      setLoading(false);
    }
  };

  // Trigger refetch on filter change
  useEffect(() => {
    setTriggerFetch((prev) => prev + 1);
  }, [fromDate, toDate, searchStatus, debouncedSearch]);

  return (
    <div className="card card-grid min-w-full">
      <div className="card-header flex-wrap gap-2">
      <h3 className="card-title font-medium text-sm">
          Showing {totalCount} Reservation
        </h3>
        <div className="flex gap-2">
        <div className="custom-datepicker-wrapper ">
        <DateRangeFilter
            onChange={({ from, to }) => {
              setFromDate(from || "");
              setToDate(to || "");
            }}
          />
          </div>
          <label className="input input-sm w-60 h-10">
            <KeenIcon icon="magnifier" />
            <input
              type="text"
              placeholder="Search by Name , id or Title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <select
            className="select select-md"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            <option value="">Status</option>
            <option value="1">Active</option>
            <option value="2">Completed</option>
            <option value="3">Cancelled</option>
            <option value="4">Waiting Payment</option>
            <option value="5">Waiting Confirmation</option>
          </select>
        </div>
      </div>

      <div className="card-body">
        <DataGrid
          columns={columns}
          serverSide
          onFetchData={fetchBookings}
          key={triggerFetch}
          isLoading={loading}
          pagination={{
            page: 0,
            size: 5,
          }}
        />
      </div>
    </div>
  );
};

export { Teams };
