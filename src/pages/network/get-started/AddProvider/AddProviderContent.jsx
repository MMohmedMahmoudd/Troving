import { useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MuiPhoneInput from './MuiPhoneInput';
import { CrudAvatarUpload } from './CrudAvatarUpload';
const AddProviderContent = () => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
    // Step 1
      person_image: "",
      person_status: '',
      person_name: '',
      person_email: '',
      person_password: '',
      person_mobile: '',
      country_code: '', 

      // Add other fields here...
    },
    validationSchema: Yup.object({
        // Step 1

      person_name: Yup.string().required('Name is required'),
      person_email: Yup.string().email('Invalid email').required('Email is required'),
      person_password: Yup.string().min(6).required('Password is required'),
      person_mobile: Yup.string()
      .required('Mobile number is required')
      .matches(/^\d+$/, 'Must be numeric only'), // ensures it's numbers only
    
    country_code: Yup.string()
      .required('Country code is required')
      .max(4, 'Too long'), // ensures it's like '+20', '+966'
  person_status: Yup.string().required('person_status is required'),

        }),
    onSubmit: (values) => {
      console.log('Form submitted:', values);
      // your submission logic here
    },
  });
  
  const handleFileChange = (file) => {
    formik.setFieldValue('person_image', file);
  };
  
  const togglePassword = event => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  
  const handleSubmit = async () => {
    try {
      // Run validation first
      const errors = await formik.validateForm();
  
      if (Object.keys(errors).length > 0) {
        formik.setTouched(
          Object.keys(errors).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {}),
          true
        );
        enqueueSnackbar('Please complete all required fields.', { variant: 'error' });
        return;
      }
  
      setLoading(true);
  
      const data = new FormData();
      Object.entries(formik.values).forEach(([key, val]) => {
        data.append(key, val);
      });
  
      const token = JSON.parse(localStorage.getItem(
        import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION
      ))?.access_token;
  
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/user/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('✅ Provider Created:', response.data);
      enqueueSnackbar('Provider created successfully!', { variant: 'success' });
      navigate('/Providers');
  
    } catch (error) {
      console.error('❌ Submission failed:', error);
      const responseErrors = error?.response?.data?.errors || {};
      setErrors(responseErrors); // field-level fallback
  
      const errorMessage =
        error?.response?.data?.message ||
        Object.values(responseErrors)[0]?.[0] ||
        'Something went wrong. Please try again.';
  
      enqueueSnackbar(errorMessage, { variant: 'error' });
  
    } finally {
      setLoading(false);
    }
  };
  
  return (
<form className="w-full" onSubmit={formik.handleSubmit}>
        {/* Dashed Line Separator Between Steps */}

      {/* Stepper Body */}
      <div className="card-body p-1">
  <div  className="grid grid-cols-1 xl:grid-cols-3 gap-4">
    <div className="parent-cruds xl:col-span-1  col-span-3 card p-6">
    <div className=" flex justify-center items-center dark:bg-gray-200 bg-gray-100 rounded-lg py-4 flex-col gap-y-4 mb-4">
      <label className="block text-sm font-medium mb-1">Provider Logo  </label> 
      <CrudAvatarUpload onFileChange={handleFileChange} />
      {errors.person_image && <p className="text-red-500 text-sm mt-1">{errors.person_image}</p>}

      <p className="text-sm text-center text-gray-500 mt-1">Only *.png, *.jpg, and *.jpeg person_image files are accepted.</p>
      </div>
      <div className=" card px-3 py-3 ">
  <label className="form-label mb-1">person_status</label>
  <select
    className="select"
    {...formik.getFieldProps('person_status')}
  >
    <option value="">Select status</option>
    <option value="1">Active</option>
    <option value="0">Inactive</option>
    <option value="3">Waiting Confirmation</option>
  </select>
  {formik.touched.person_status && formik.errors.person_status && (
    <span role="alert" className="text-danger text-xs mt-1">{formik.errors.person_status}</span>
  )}
</div>

    </div>

    {/* Basic Information Card */}
    <div className="col-span-3 xl:col-span-2 card p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Provider Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label mb-1">Name</label>
          <input
            className="input"
            {...formik.getFieldProps('person_name')}
          />
          {formik.touched.person_name && formik.errors.person_name && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.person_name}</p>
          )}
        </div>
        
        <div>
          <label className="form-label mb-1">Email</label>
          <input
            className="input"
            {...formik.getFieldProps('person_email')}
          />
          {formik.touched.person_email && formik.errors.person_email && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.person_email}</p>
          )}
        </div>
        <div>
          <label className="form-label mb-1">Mobile Number</label>
          <MuiPhoneInput
            value={formik.values.person_mobile}
            defaultCountry="EG"
            forceCallingCode
            onChange={(value, info) => {
              // Remove the leading '+' and country code safely
              const cleaned = value.replace(/[^0-9]/g, ''); // Remove all non-digits
              const cc = info?.countryCallingCode || '20'; // fallback to Egypt
              const mobile = cleaned.startsWith(cc) ? cleaned.slice(cc.length) : cleaned;

              formik.setFieldValue('person_mobile', mobile); // e.g. 1150595619
              formik.setFieldValue('country_code', `+${cc}`); // e.g. +20
            }}
          />
          {formik.touched.person_mobile && formik.errors.person_mobile && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.person_mobile}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between">
            <label className="form-label mb-1">Password</label>
          </div>

          <label className="input w-full relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="off"
              {...formik.getFieldProps('person_password')}
              className={clsx('form-control w-full', {
                'is-invalid': formik.touched.person_password && formik.errors.person_password
              })}
            />
            <button
              type="button"
              className="btn btn-icon absolute right-2 top-1/2 -translate-y-1/2"
              onClick={togglePassword}
              tabIndex={-1}
            >
              <i className={clsx('ki-filled ki-eye text-gray-500', { hidden: showPassword })}></i>
              <i className={clsx('ki-filled ki-eye-slash text-gray-500', { hidden: !showPassword })}></i>
            </button>
          </label>

          {formik.touched.person_password && formik.errors.person_password && (
            <span role="alert" className="text-danger text-xs mt-1">{formik.errors.person_password}</span>
          )}
        </div>

        <div className="col-span-2 content-end">
          <div className="flex justify-end mt-4 ">
        <button
  type="button"
  className="btn  bg-gradient-primary -translate-x-2 hover:translate-x-0 outline-0 border-0 text-white"
  disabled={loading}
  onClick={() => {
    formik.validateForm().then(errors => {
      if (Object.keys(errors).length === 0) {
        handleSubmit(); // If valid
      } else {
        enqueueSnackbar('Please complete all required fields.', { variant: 'error' });

        // Touch all fields to show errors
        Object.keys(errors).forEach((key) => {
          formik.setFieldTouched(key, true);
        });
      }
    });
  }}
>
  {loading ? 'Saving...' : 'SaveChanges'}
        </button>
        </div>
        </div>
      </div>
    </div>
    {/* Business Information Card */}
  </div>
  </div>
      {/* Footer Buttons */}
</form>
  );
};

export  {AddProviderContent};