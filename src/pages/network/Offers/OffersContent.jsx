import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { DataGrid, KeenIcon } from '@/components';
import { useNavigate } from 'react-router-dom';
import { DateRangeFilter } from '@/components';
import { toAbsoluteUrl } from '@/utils';
const OffersContent = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [refetchKey, setRefetchKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPageIndex(0);
      setRefetchKey(prev => prev + 1);
    }, 100);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setRefetchKey(prev => prev + 1);
  }, [debouncedSearch, statusFilter, fromDate, toDate]);


  const handleRowClick = (providerId) => {
    navigate(`/OfferProfile/${providerId}`);
  };

  const columns = useMemo(() => [
    {
      id: 'offer_uid',
      header: 'ID',
      accessorKey: 'id',
      enableSorting: true,
      meta: { className: 'w-[50px]' },
    },
    {
      id: 'title',
      header: 'Offer',
      accessorKey: 'title',
      enableSorting: true,
      meta: { className: 'min-w-[320px]' },
      cell: ({ row }) => (
        <div className="text-sm">
          <strong className='cursor-pointer hover:text-primary' onClick={() => handleRowClick (row.original.id)}>{row.original.title}</strong>
        </div>
      ),
    },
    {
      id: 'city',
      header: 'City',
      accessorFn: row => row.city?.name,
      enableSorting: true,
      meta: { className: 'min-w-[150px]' },
      cell: ({ row }) => {
        const image = row.original.city?.image;
        const name = row.original.city?.name;
        return (
          <div className="flex items-center gap-x-2">
            <img src={image || toAbsoluteUrl('/media/avatars/blank.png')} alt={name} className="w-10 h-10 rounded-full object-cover" />
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      id:'offer_images',  
      header: 'Business Name',
      accessorKey: 'offer_images',
      enableSorting: true,
      meta: { className: 'min-w-[220px]' },
      cell: ({ row }) => {
        const offer_images = row.original.offer_images || [];
        const city = row.original.city?.name;
        const business_name = row.original.business_name;
        
        // If offer_images is an array, display the first image
        if (Array.isArray(offer_images) && offer_images.length > 0) {
          return<> 
            <div className="flex items-center justify-start gap-x-4">
              <img 
                src={offer_images[0] || toAbsoluteUrl('/media/avatars/blank.png')} 
                alt={city} 
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = toAbsoluteUrl('/media/avatars/blank.png'); // You may want to add a placeholder image
                }}
              />
              <span>{business_name}</span>
            </div>
          
        </>
        }
        
        // If it's a single string URL
        if (typeof offer_images === 'string') {
          return (
            <div className="flex items-center">
              <img 
                src={offer_images || toAbsoluteUrl('/media/avatars/blank.png')} 
                alt={city} 
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = toAbsoluteUrl('/media/avatars/blank.png'); // You may want to add a placeholder image
                }}
              />
            </div>
          );
        }

        return null;
      },
    },

    {
      id: 'offer_add_date',
      header: 'Created Date',
      accessorKey: 'offer_add_date',
      enableSorting: true,
      meta: { className: 'min-w-[190px]' },
    },
    {
      id: 'offer_end_date',
      header: 'End Date',
      accessorKey: 'offer_end_date',
      enableSorting: true,
      meta: { className: 'min-w-[150px]' },
    },
    {
      id: 'coupon_end_date',
      header: 'Coupon End Date',
      accessorFn: row => row.original.coupon_end_date,
      enableSorting: true,
      cell: ({ row }) => row.original.coupon_end_date ?? '—',
      meta: { className: 'min-w-[170px]' },

    },

    {
      id: 'offer_copouns_qty',
      header: 'Coupons',
      accessorKey: 'offer_copouns_qty',
      enableSorting: true,
      meta: { className: 'min-w-[100px]' },

    },
    {
      id: 'offer_price',
      header: 'Price',
      accessorFn: row => row.offer_price + ' ' + row.currency_name,
      enableSorting: true,
      meta: { className: 'min-w-[110px]' },

      
    },
    {
      id: 'count_of_reservations_on_this_offer',
      header: 'Reservations',
      accessorKey: 'count_of_reservations_on_this_offer',
      enableSorting: true,
      meta: { className: 'min-w-[70px]' },
    },
    {
      id: 'count_of_active_reservations_on_this_offer',
      header: 'Reservations Active',
      accessorKey: 'count_of_active_reservations_on_this_offer',
      enableSorting: true,
      meta: { className: 'min-w-[100px]' },
 
    },
    {
      id: 'status',
      header: 'Status',
      accessorFn: row => row.offer_status,
      enableSorting: true,
      cell: ({ row }) => {
        const status = row.original.offer_status;
        const color =
          status === 'active' ? 'success' :
          status === 'inactive' ? 'danger' :
          'warning';
        return (
          <span className={`badge badge-${color} badge-outline capitalize`}>
            ● {status}
          </span>
        );
      },
      meta: { className: 'min-w-[100px]' },

    },

    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => (
        <button
          className="px-2 py-1 btn btn-sm btn-outline btn-primary text-blue-500"
          onClick={() => handleRowClick (row.original.id)}
        >
          <i className="ki-filled ki-notepad-edit"></i>
        </button>
      ),
    },

  ], []);
  
  const fetchProviders = async ({ pageIndex, pageSize, sorting }) => {
    try {
      setLoading(true);
      const storedAuth = localStorage.getItem(import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION);
      const authData = storedAuth ? JSON.parse(storedAuth) : null;
      const token = authData?.access_token;

      if (!token) {
        window.location.href = '/auth/login';
        return { data: [], totalCount: 0 };
      }

      const sort = sorting?.[0]?.id ?? 'offer_uid';
      const direction = sorting?.[0]?.desc ? '-' : '';
      const sort2 = sorting?.[1]?.id ?? 'offer_price';
      const direction2 = sorting?.[1]?.desc ? '-' : '';
      const sort3 = sorting?.[2]?.id ?? 'offer_copouns_qty';
      const direction3 = sorting?.[2]?.desc ? '-' : '';
      const sort4 = sorting?.[3]?.id ?? 'offer_end_date';
      const direction4 = sorting?.[3]?.desc ? '-' : '';
      const sort5 = sorting?.[4]?.id ?? 'offer_status';
      const direction5 = sorting?.[4]?.desc ? '-' : '';
      const params = [
        `perPage=${pageSize}`,
        `page=${pageIndex + 1}`,
      ];

      if (debouncedSearch) {
        if (/^\d+$/.test(debouncedSearch)) {
          if (debouncedSearch.length <= 5) {
            params.push(`filter[offer_uid]=${debouncedSearch}`);
          } else {
            params.push(`filter[offer_title]=${debouncedSearch}`);
          }
        } else if (debouncedSearch.includes(' ') && debouncedSearch.length > 3) {
          params.push(`filter[sp_name]=${debouncedSearch}`);
        } else {
          params.push(`filter[offer_title]=${debouncedSearch}`);
        }
      }
  
      if (statusFilter) {
        params.push(`filter[offer_status]=${statusFilter}`);
      }

      if (fromDate) {
        params.push(`filter[offer_add_date][from]=${fromDate}`);
      }

      if (toDate) {
        params.push(`filter[offer_add_date][to]=${toDate}`);
      }

      if (sort) {
        params.push(`sort=${direction}${sort}`);
        params.push(`sort2=${direction2}${sort2}`);
        params.push(`sort3=${direction3}${sort3}`);
        params.push(`sort4=${direction4}${sort4}`);
        params.push(`sort5=${direction5}${sort5}`);
      }

      const url = `${import.meta.env.VITE_APP_API_URL}/provider/offers?` + params.join('&');
    
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const providers = res.data?.data ?? [];
      const total = res.data?.pagination?.total ?? 0;

      setTotalCount(total);
      console.log('providers:',providers);

      return { data: providers, totalCount: total };
    } catch (err) {
      console.error('❌ Error fetching providers:', err);
      return { data: [], totalCount: 0 };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-grid min-w-full relative">
      <div className="card-header flex-wrap gap-2 justify-between">
        <h3 className="card-title font-medium text-sm">
          Showing {totalCount} Offers
        </h3>
        <div className="flex items-center gap-2 w-full md:w-auto">
    <label className="input input-sm h-10 w-72">
      <KeenIcon icon="magnifier" />
      <input
        type="text"
        placeholder="Search by Offer ID or Title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </label>
    
    <DateRangeFilter
            onChange={({ from, to }) => {
              setFromDate(from || "");
              setToDate(to || "");
            }}
          />


    <select
      className="select select-sm h-10 w-40"
      value={statusFilter}
      onChange={(e) => {
        setStatusFilter(e.target.value);
        setPageIndex(0);
        setRefetchKey(prev => prev + 1);
      }}
    >
      <option value="">All</option>
      <option value="0">Inactive</option>
      <option value="1">Active</option>
      <option value="2">Waiting Confirmation</option>
    </select>
  </div>
      </div>
      <div className="card-body overflow-x-auto">
      <DataGrid
          key={refetchKey}
          columns={columns}
          serverSide
          onFetchData={fetchProviders}
          isLoading={loading}
          layout={{
            cellsBorder: true,
            tableSpacing: 'sm'
          }}
          pagination={{
            page: pageIndex,
            size: pageSize,
            onPageChange: setPageIndex,
            onPageSizeChange: setPageSize,
          }}
          messages={{
            empty: 'No data available',
            loading: 'Loading data...'
          }}
        />
        {loading && (
          <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center h-full	">
            <div className="flex items-center gap-2 px-4 py-2 dark:bg-black/50 bg-white/90 rounded-lg shadow-lg">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-700">Loading offers...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { OffersContent };
