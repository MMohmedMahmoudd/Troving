import { Tabs, Tab, TabsList, TabPanel } from "@/components/tabs";
import { useState } from "react";
import MuiPhoneInput from './MuiPhoneInput';
import { OffersTable } from "./OffersTable";
import { useParams } from 'react-router-dom';
import { ProviderDocuments } from "./ProviderDocuments";
import { ProviderReviewsTable } from "./ProviderReviewsTable";
import { ProviderPaymentsTable } from "./ProviderPaymentsTable";
import PropTypes from 'prop-types';
import { ProviderBranchesTable } from './ProviderBranchesTable';
import { ReservationTap } from './ReservationTap';
import { useSearchParams } from 'react-router-dom'; // Add this import
import axios from 'axios';
import { useSnackbar } from 'notistack';
const BussinessDefaultContent = ({ provider }) => {
  const { id } = useParams(); // Get the ID directly from URL params
  const [searchParams] = useSearchParams(); // read URL parameters
  const tabFromURL = searchParams.get('tab') || "Information"; // get tab from URL
  const [activeTab, setActiveTab] = useState(tabFromURL); // set initial tab based on URL
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  
  const mapProviderToFormData = (provider) => {
    const formData = new FormData();
  
    // User and provider info
    formData.append('person_uid', provider.user?.id || '');
    formData.append('sp_type_uid', provider.type?.id || '');
    formData.append('sp_name_english', provider.name || '');
    formData.append('sp_name_arabic', provider.name || '');
    formData.append('sp_description_english', provider.description || '');
    formData.append('sp_description_arabic', provider.description || '');
    formData.append('sp_status', provider.status === 'active' ? 1 : provider.status === 'inactive' ? 0 : 2);
  
    // Images (if you have file inputs, otherwise skip or use URLs)
    // formData.append('sp_image', fileInput.files[0]);
    // formData.append('sp_license_image[]', ...);
  
    // Branch info (using main_branch as example)
    const branch = provider.main_branch || {};
    formData.append('branch_address_english', branch.address_both_lang?.en || '');
    formData.append('branch_address_arabic', branch.address_both_lang?.ar || '');
    formData.append('city_uid', branch.city?.id || '');
    formData.append('zone_uid', branch.zone?.id || '');
    formData.append('branch_name_english', branch.name_both_lang?.en || '');
    formData.append('branch_name_arabic', branch.name_both_lang?.ar || '');
    formData.append('branch_phone', branch.phone || '');
    formData.append('branch_latitude', branch.latitude || '');
    formData.append('branch_longitude', branch.longitude || '');
    // formData.append('branch_email', branch.email || '');
  
    // Method override for PUT
    formData.append('_method', 'PUT');
  
    return formData;
  };

  const handleUpdateProvider = async () => {
    setLoading(true);
    try {
      const formData = mapProviderToFormData(provider);
  
      const token = JSON.parse(localStorage.getItem(
        import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION
      ))?.access_token;
  
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/provider/${provider.id}/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      enqueueSnackbar('Provider updated successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update provider.', { variant: 'error' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };  
  if (!provider) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card p-4 text-center">
          <h4 className="text-lg font-semibold">{provider.statistics?.offers_count || 0}</h4>
          <p className="text-sm text-gray-500">Total Offers</p>
        </div>
        <div className="card p-4 text-center">
          <h4 className="text-lg font-semibold">{provider.statistics?.active_offers_count || 0}</h4>
          <p className="text-sm text-gray-500">Active offers</p>
        </div>
        <div className="card p-4 text-center">
          <h4 className="text-lg font-semibold">{provider.statistics?.bookings_count || 0}</h4>
          <p className="text-sm text-gray-500">Bookings</p>
        </div>
        <div className="card p-4 text-center">
          <h4 className="text-lg font-semibold">{provider.statistics?.reviews_count || 0}</h4>
          <p className="text-sm text-gray-500">Reviews</p>
        </div>
        <div className="card p-4 text-center">
          <h4 className="text-lg font-semibold">
            {provider.net_profit
              ? provider.net_profit >= 1000
                ? (provider.net_profit / 1000).toFixed(1) + 'k'
                : provider.net_profit
              : 0}
          </h4>
          <p className="text-sm text-gray-500">Total Earning</p>
        </div>
      </div>
      <div className="mt-5">
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <TabsList className="flex flex-wrap">
            <Tab value="Information">Information</Tab>
            <Tab value="Provider">Provider</Tab>
            <Tab value="Offers">Offers</Tab>
            <Tab value="Documents">Documents</Tab>
            <Tab value="Reviews">Reviews</Tab>
            <Tab value="Reservations">Reservations</Tab>
            <Tab value="Branches">Branches</Tab>
            <Tab value="Payments">Payments</Tab>
          </TabsList>
          <TabPanel value="Information">
            <div className="grid grid-cols-1 mt-5 xl:grid-cols-1 gap-5 lg:gap-7.5">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Business Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="form-label mb-1">Business Type</label>
                    <input className="input" value={provider.type?.name || ''} readOnly />
                  </div>
                  <div className="col-span-1">
                    <label className="form-label mb-1">Percentage</label>
                    <input className="input" value={provider.commission_percentage || ''} readOnly />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="form-label mb-1">Business Name In English</label>
                    <input className="input" value={provider.name} readOnly />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label mb-1">Business Name In Arabic</label>
                    <input className="input" value={provider.name} readOnly />
                  </div>

                  <div className="col-span-2">
                    <label className="form-label mb-1">Business Description In English</label>
                    <textarea className="textarea text-slate-100 dark:text-gray-700 " value={provider.description} readOnly />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label mb-1">Business Description In Arabic</label>
                    <textarea className="textarea text-slate-100 dark:text-gray-700 " value={provider.description} readOnly />
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="Provider">
            <div className="grid grid-cols-1 mt-5 xl:grid-cols-1 gap-5 lg:gap-7.5">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label mb-1"> Name</label>
                    <input className="input" value={provider.user?.name || ''} readOnly />
                  </div>
                  <div>
                    <label className="form-label mb-1"> Email</label>
                    <input className="input" value={provider.user?.email || ''} readOnly />
                  </div>
                  <div>
                    <label className="form-label mb-1"> Phone Number</label>
                    <MuiPhoneInput
                      value={provider.user?.mobile || ''}
                      onChange={(value) => console.log(value)}
                      defaultCountry="SA"
                      className="input"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="Offers">
            <div className="grid grid-cols-1 mt-5 xl:grid-cols-1 gap-5 lg:gap-7.5">
                <OffersTable providerId={id} /> {/* Use the URL parameter directly */}
            </div>
          </TabPanel>
          <TabPanel value="Documents">
            <div className="grid grid-cols-1 mt-5 xl:grid-cols-1 gap-5 lg:gap-7.5">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Documents</h3>
                {/* Add your Documents content here */}
                <ProviderDocuments providerId={id} />

              </div>
            </div>
          </TabPanel>
          <TabPanel value="Reviews">
            <div className="grid grid-cols-1 mt-5 xl:grid-cols-1 gap-5 lg:gap-7.5">
                {/* Add your sales report content here */}
                <ProviderReviewsTable providerId={id} />

              </div>
          </TabPanel>
          <TabPanel value="Reservations">
            <div className="grid grid-cols-1 mt-5 xl:grid-cols-1 gap-5 lg:gap-7.5">
                <ReservationTap providerId={id} />
            </div>
          </TabPanel>
          <TabPanel value="Branches">
            <div className="grid grid-cols-1 mt-5 xl:grid-cols-1 gap-5 lg:gap-7.5">
                {/* Add your assigns content here */}
                <ProviderBranchesTable providerId={id} />

            </div>
          </TabPanel>
          <TabPanel value="Payments">
            <div className="grid grid-cols-1 mt-5 xl:grid-cols-1 gap-5 lg:gap-7.5">
                {/* Add your assigns content here */}
                <ProviderPaymentsTable providerId={id} provider={provider} />

              </div>
          </TabPanel>
        </Tabs>
      </div>
      {(activeTab === 'Information' || activeTab === 'Provider') && (
        <div className="flex mt-4 justify-end items-center">
<button
  className="btn btn-outline btn-primary"
  onClick={handleUpdateProvider}
  disabled={loading}
>
  {loading ? 'Saving...' : 'Save Changes'}
</button>        </div>
      )}

    </>
  );
};

BussinessDefaultContent.propTypes = {
  provider: PropTypes.shape({
    statistics: PropTypes.shape({
      offers_count: PropTypes.number,
      active_offers_count: PropTypes.number,
      bookings_count: PropTypes.number,
      reviews_count: PropTypes.number,
      branches_count: PropTypes.number
    }),
    net_profit: PropTypes.number,
    type: PropTypes.shape({
      name: PropTypes.string
    }),
    name: PropTypes.string,
    description: PropTypes.string,
    commission_percentage: PropTypes.number,
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      mobile: PropTypes.string
    })
  }).isRequired
};

export { BussinessDefaultContent };