import { useState } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PersonNameSelect } from '../../Bussiness/AddBussiness/PersonNameSelect';
import { BusinessSelect } from './BusinessSelect';
import {FlowbiteHtmlDatepicker} from '@/components';
import {OfferSelect} from './OfferSelect';
import { BranchesSelect } from './BranchesSelect';

const AddReservationContent = () => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      person_uid: '',
      sp_uid: '',
      offer_uid: '',
      booking_status: '6', // Defaulting to 1 as seen in Postman
      booking_date: '',
      qty: '',
      branch_uid: '',
    },
    validationSchema: Yup.object({
      person_uid: Yup.string().required('Name is required'),
      sp_uid: Yup.string().required('Business is required'),
      offer_uid: Yup.string().required('Offer is required'),
      booking_date: Yup.string().required('Booking date is required'),
      qty: Yup.string().required('Coupon quantity is required'),
      branch_uid: Yup.string().required('Branch is required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
    
        const data = new FormData();
        Object.entries(values).forEach(([key, val]) => {
          // Handle multi-select for branches_id if needed, but API expects single branch_uid
          // For now, assuming branch_uid is a single value string/number
          data.append(key, val);
        });
    
        const token = JSON.parse(localStorage.getItem(
          import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION
        ))?.access_token;
    
        await axios.post(`${import.meta.env.VITE_APP_API_URL}/reservation/create`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        enqueueSnackbar('Reservation created successfully!', { variant: 'success' });
        navigate('/reservations');
    
      } catch (error) {
        console.error('❌ Submission failed:', error);
        const responseErrors = error?.response?.data?.errors || {};
    
        const errorMessage =
          error?.response?.data?.message ||
          Object.values(responseErrors)[0]?.[0] ||
          'Something went wrong. Please try again.';
    
        enqueueSnackbar(errorMessage, { variant: 'error' });
    
      } finally {
        setLoading(false);
      }
    }
  });
  
  return (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <div className="card-body p-1">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Basic Information Card */}
          <div className="col-span-3 xl:col-span-2 card p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Business Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <PersonNameSelect formik={formik} />
                 {formik.touched.person_uid && formik.errors.person_uid && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.person_uid}</p>
                )}
              </div>

              <div className="col-span-1">
                <label className='form-label mb-2'>Business</label>
                <BusinessSelect formik={formik} />
                 {formik.touched.sp_uid && formik.errors.sp_uid && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.sp_uid}</p>
                )}
              </div>

              <div className="col-span-1">
                <label className="form-label mb-2">Offer</label>
                <OfferSelect formik={formik} />
                {formik.touched.offer_uid && formik.errors.offer_uid && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.offer_uid}</p>
                )}
              </div>

              <div className="col-span-1">
                <label className="form-label mb-2">Coupon Quantity</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Coupon Quantity"
                  {...formik.getFieldProps('qty')}
                />
                {formik.touched.qty && formik.errors.qty && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.qty}</p>
                )}
              </div>

              <div className="col-span-1">
                <label className="form-label mb-2">Booking Date</label>
                <FlowbiteHtmlDatepicker
                className="z-0"
                  value={formik.values.booking_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="booking_date"
                  placeholder="Select Booking Date"
                />
                {formik.touched.booking_date && formik.errors.booking_date && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.booking_date}</p>
                )}
              </div>

              <div className="col-span-1">
                <label className="form-label mb-2">Branch</label>
                <BranchesSelect formik={formik} />
                {formik.touched.branch_uid && formik.errors.branch_uid && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.branch_uid}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="card-footer py-8 flex justify-end">
        <button
          type="button"
          className="btn btn-success"
          disabled={loading}
          onClick={() => {
            formik.validateForm().then(errors => {
              if (Object.keys(errors).length === 0) {
                formik.handleSubmit();
              } else {
                console.log("❌ Form blocked due to errors:", errors);
                enqueueSnackbar("Please complete all required fields.", { variant: "error" });

                // Touch fields to show errors
                Object.keys(errors).forEach(key => formik.setFieldTouched(key, true));
              }
            });
          }}
        >
          {loading ? 'Saving...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export { AddReservationContent };