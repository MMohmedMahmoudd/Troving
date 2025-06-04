import { useMemo, useEffect, useState } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { customStyles } from '../../Bussiness/AddBussiness/PersonNameSelect';
import axios from 'axios';

const customMultiValueStyles = {
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#f0f0f0', // Badge background
    borderRadius: '9999px',      // Full rounded
    padding: '2px 6px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    color: '#333',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#333',
    fontWeight: '500',
    padding: '0 4px',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#666',
    borderRadius: '50%',
    ':hover': {
      backgroundColor: '#F44336',
      color: '#fff',
      width: '20px',
      height: '20px',
      cursor:'pointer'
    },
  }),
};

const BranchesSelect = ({ offer, selectedCity, formik, providerId }) => {
  const [providerBranches, setProviderBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProviderBranches = async () => {
      if (!providerId) return;
      
      try {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem(
          import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION
        ))?.access_token;

        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/provider/${providerId}/profile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Extract branches from the provider profile response
        const branches = response.data.data.branches || [];
        setProviderBranches(branches);
      } catch (error) {
        console.error('Error fetching provider branches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderBranches();
  }, [providerId]);

  const branches = useMemo(() => {
    // Get the selected branch IDs from the offer
    const selectedBranchIds = offer?.branches?.map(branch => branch.id) || [];
    
    // Filter provider branches to only include those that are in the offer's selected branches
    const filteredProviderBranches = providerBranches.filter(branch => 
      selectedBranchIds.includes(branch.id)
    );

    const options = filteredProviderBranches.map(branch => {
      let label = branch.name?.trim();
      if (!label) {
        label = branch.address?.trim() || branch.phone || 'Unnamed Branch';
      }

      return {
        value: branch.id,
        label,
        cityName: branch.city?.name || '',
        fullData: branch
      };
    });

    return [
      { value: 'all', label: 'All Branches', cityName: 'All' },
      ...options
    ];
  }, [offer?.branches, providerBranches]);

  const filteredBranches = useMemo(() => {
    if (!selectedCity || selectedCity.toLowerCase() === 'all cities') {
      return branches;
    }
    return branches.filter(branch => branch.cityName?.toLowerCase() === selectedCity.toLowerCase());
  }, [branches, selectedCity]);
  
  return (
    <Select
      className="react-select"
      classNamePrefix="select"
      options={filteredBranches}
      placeholder={loading ? "Loading branches..." : "Select Branch"}
      isMulti={true}
      closeMenuOnSelect={false}
      isLoading={loading}
      onBlur={() => {
        formik.setFieldTouched('branches_id', true);
      }}
      value={filteredBranches.filter(opt => formik.values.branches_id?.includes(opt.value))}
      onChange={(selectedOptions) => {
        if (!selectedOptions) {
          formik.setFieldValue('branches_id', []);
          return;
        }
    
        const selectedValues = selectedOptions.map(option => option.value);
    
        if (selectedValues.includes('all')) {
          formik.setFieldValue('branches_id', ['all']);
        } else {
          formik.setFieldValue('branches_id', selectedValues);
        }
      }}
      isClearable
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      styles={{ ...customStyles, ...customMultiValueStyles }}
    />
  );
};

BranchesSelect.propTypes = {
  offer: PropTypes.shape({
    branches: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      phone: PropTypes.string,
      address: PropTypes.string,
      city: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
      })
    }))
  }).isRequired,
  formik: PropTypes.object.isRequired,
  selectedCity: PropTypes.string,
  providerId: PropTypes.string
};

export { BranchesSelect };
