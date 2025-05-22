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

const BussinessDefaultContent = ({ provider }) => {
  const { id } = useParams(); // Get the ID directly from URL params
  const [searchParams] = useSearchParams(); // read URL parameters
  const tabFromURL = searchParams.get('tab') || "Information"; // get tab from URL
  const [activeTab, setActiveTab] = useState(tabFromURL); // set initial tab based on URL

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
      <div className="flex mt-4 justify-end items-center">
        <button className="btn btn-outline btn-primary">Save Changes</button>
      </div>

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