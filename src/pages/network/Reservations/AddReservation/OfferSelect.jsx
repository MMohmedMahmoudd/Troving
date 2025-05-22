import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { customStyles } from '../../Bussiness/AddBussiness/PersonNameSelect';

const OfferSelect = ({ formik }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const token = JSON.parse(localStorage.getItem(
          import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION
        ))?.access_token;
    
        let allOffers = [];
        let page = 1;
        let lastPage = 1;
    
        do {
          const res = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/provider/offers?page=${page}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
    
          const offers = res.data?.data || [];
          lastPage = res.data?.pagination?.last_page || 1;
          allOffers = allOffers.concat(offers);
          page++;
        } while (page <= lastPage);
    
        setOptions(allOffers.map((offer) => ({
          value: offer.id.toString(),
          label: offer.title,
        })));
      } catch (error) {
        console.error("Failed to load offers", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOffers();
  }, []);

  const selected = options.find(opt => opt.value === formik.values.offer_uid);

  return (
    <Select
      options={options}
      isLoading={loading}
      placeholder="Select Offer"
      styles={customStyles}
      value={selected || null}
      onChange={(selected) => formik.setFieldValue('offer_uid', selected?.value || '')}
      onBlur={() => formik.setFieldTouched('offer_uid', true)}
    />
  );
};


export {OfferSelect};
