import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { DataGrid, KeenIcon } from '@/components';
import { useNavigate } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';

const CurrenciesContent = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [refetchKey, setRefetchKey] = useState(0);
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
  }, [debouncedSearch]);

  const handleRowClick = (currencyId) => {
    navigate(`/editsubcategory/${currencyId}`);
  };

  const columns = useMemo(() => [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      enableSorting: true,
      meta: { className: 'w-[50px]' },
    },
    {
      id: 'title',
      header: 'Currency Name',
      accessorKey: 'title',
      enableSorting: true,
      meta: { className: 'min-w-[150px]' },
    },
    {
      id: 'rate',
      header: 'Rate',
      accessorKey: 'rate',
      enableSorting: true,
      meta: { className: 'min-w-[100px]' },
    },
    {
      id: 'country',
      header: 'Currency',
      accessorKey: 'country.currency_iso',
      enableSorting: true,
      meta: { className: 'min-w-[100px]' },
    },
    {
      id: 'created_at',
      header: 'Created Date',
      accessorKey: 'created_at',
      enableSorting: true,
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
      meta: { className: 'min-w-[120px]' },
    },
    {
      id: 'updated_at',
      header: 'Updated Date',
      accessorKey: 'updated_at',
      enableSorting: true,
      cell: ({ row }) => new Date(row.original.updated_at).toLocaleDateString(),
      meta: { className: 'min-w-[120px]' },
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => (
        <button
          className="px-2 py-1 btn btn-sm btn-outline btn-primary text-blue-500"
          onClick={() => handleRowClick(row.original.id)}
        >
          <i className="ki-filled ki-notepad-edit"></i>
        </button>
      ),
      meta: { className: 'w-[50px]' },
    },
  ], []);

  const fetchCurrencies = async ({ pageIndex, pageSize, sorting }) => {
    try {
      setLoading(true);
      const storedAuth = localStorage.getItem(import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION);
      const authData = storedAuth ? JSON.parse(storedAuth) : null;
      const token = authData?.access_token;

      if (!token) {
        window.location.href = '/auth/login';
        return { data: [], totalCount: 0 };
      }

      const sort = sorting?.[0]?.id;
      const params = [
        `perPage=${pageSize}`,
        `page=${pageIndex + 1}`,
      ];

      if (debouncedSearch) {
        params.push(`filter[title]=${debouncedSearch}`);
      }
      if (sort) {
        params.push(`sort=${sort}`);
      }

      const url = `${import.meta.env.VITE_APP_API_URL}/currencies?` + params.join('&');
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const currencies = res.data?.data ?? [];
      const total = currencies.length;

      setTotalCount(total);

      return { data: currencies, totalCount: total };
    } catch (err) {
      console.error('❌ Error fetching currencies:', err);
      return { data: [], totalCount: 0 };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-grid col-span-4 relative">
      <div className="card-header flex-wrap gap-2 justify-between">
        <h3 className="card-title font-medium text-sm">
          Showing {totalCount} Currencies
        </h3>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="input input-sm h-10 w-72">
            <KeenIcon icon="magnifier" />
            <input
              type="text"
              placeholder="Search by Category Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          
        </div>
      </div>
      <div className="card-body overflow-x-auto">
        <DataGrid
          key={refetchKey}
          columns={columns}
          serverSide
          onFetchData={fetchCurrencies}
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
          <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center h-full">
            <div className="flex items-center gap-2 px-4 py-2 dark:bg-black/50 bg-white/90 rounded-lg shadow-lg">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-700">Loading categories...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { CurrenciesContent };
