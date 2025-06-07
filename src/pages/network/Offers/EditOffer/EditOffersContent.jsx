import { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Tab, TabsList, TabPanel } from "@/components/tabs";
import { toAbsoluteUrl } from '@/utils';
import 'leaflet/dist/leaflet.css';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CrudMultiImageUpload } from './CrudMultiImageUpload';
import { BusinessSelect } from './BusinessSelect';
import { CategorySelect } from './CategorySelect';
import {FlowbiteHtmlDatepicker} from '@/components';
import { BranchesSelect } from './BranchesSelect';
import { CitySelect } from './CitySelect';
import { useParams } from 'react-router-dom';

const EditOffersContent = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [activeTab, setActiveTab] = useState("English");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      business_id: offer?.user?.id?.toString() || '',
      businessData: {
        id: offer?.user?.id?.toString() || '',
        name: offer?.user?.name || '',
        image: offer?.user?.image || '',
        type: {
          id: offer?.type?.id?.toString() || '',     // 🟢 this is the fix
          title: offer?.type?.title || '',
        },
      },
      cat_uid:'', // ← after backend adds sub_category
      offer_price: offer?.offer_price || '',
      offer_copouns_qty: offer?.offer_copouns_qty || '',
      offer_images: offer?.offer_images || [], // You can preload these into your image uploader if needed
      offer_end_date: offer?.offer_end_date || '',
      coupon_end_date: offer?.coupon_end_date || '',
      checkAvailability: offer?.check_availability || 0,
    
      // English
      offer_title_english: offer?.title || '',
      offer_description_english: offer?.description || '',
      offer_highlights_english: offer?.offer_highlights || '',
      offer_inclusions_english: offer?.offer_inclusions || '',
      offer_exclusions_english: offer?.offer_exclusions || '',
      offer_cancel_policy_english: offer?.offer_cancel_policy || '',
      offer_know_before_go_english: offer?.offer_terms_conditions || '',
    
      // Arabic (fill with empty or translated later if you have Arabic fields)
      offer_title_arabic: '',
      offer_description_arabic: '',
      offer_highlights_arabic: '',
      offer_inclusions_arabic: '',
      offer_exclusions_arabic: '',
      offer_cancel_policy_arabic: '',
      offer_know_before_go_arabic: '',
    
      branches_id: offer?.branches?.map(branch => branch.id) || [], // Initialize with branch IDs from the offer
      offer_status: (() => {
        const raw = offer?.offer_status?.toString().toLowerCase();
        if (raw === '1' || raw === 'active') return '1';
        if (raw === '2' || raw === 'pending') return '2';
        if (raw === '0' || raw === 'inactive') return '0';
        return '';
      })(),
            city_name: offer?.city?.name || '',
      city_uid: offer?.city?.id?.toString() || '',
    },
        validationSchema: Yup.object({
      business_id: Yup.string().required('Business is required'),
      cat_uid: Yup.string().required('Category is required'),
      offer_price: Yup.string().required('Price is required'),
      offer_copouns_qty: Yup.string().required('Coupon quantity is required'),
      offer_end_date: Yup.string().required('Offer end date is required'),
      coupon_end_date: Yup.string().required('Coupon end date is required'),
      offer_title_english: Yup.string().required('English title is required'),
      offer_description_english: Yup.string().required('English description is required'),
      offer_title_arabic: Yup.string().required('Arabic title is required'),
      offer_description_arabic: Yup.string().required('Arabic description is required'),
      offer_status: Yup.string().required('Status is required'),
      offer_images: Yup.array().of(Yup.mixed()).required('Offer images are required'),
      offer_highlights_english: Yup.string().required('English highlights are required'),
      offer_highlights_arabic: Yup.string().required('Arabic highlights are required'),
      offer_inclusions_english: Yup.string().required('English inclusions are required'),
      offer_inclusions_arabic: Yup.string().required('Arabic inclusions are required'),
      offer_exclusions_english: Yup.string().required('English exclusions are required'),
      offer_exclusions_arabic: Yup.string().required('Arabic exclusions are required'),
      offer_cancel_policy_english: Yup.string().required('English cancellation policy is required'),
      offer_cancel_policy_arabic: Yup.string().required('Arabic cancellation policy is required'),
      offer_know_before_go_english: Yup.string().required('English terms and conditions are required'),
      offer_know_before_go_arabic: Yup.string().required('Arabic terms and conditions are required'),
      branches_id: Yup.array().min(1, 'At least one branch must be selected').required('Branch is required'),
      city_name: Yup.string().required('City is required'),
      city_uid: Yup.string().required('City is required'),
    }),
        onSubmit: (values) => {
      console.log('Form submitted:', values);
      // your submission logic here
    },
  });

    useEffect(() => {
    const fetchOffer = async () => {
      try {
        const token = JSON.parse(localStorage.getItem(
          import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION
        ))?.access_token;

        // Fetch English content
        const responseEn = await axios.get(`${import.meta.env.VITE_APP_API_URL}/offer/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Accept-Language": "en"
          },
        });

        // Fetch Arabic content
        const responseAr = await axios.get(`${import.meta.env.VITE_APP_API_URL}/offer/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Accept-Language": "ar"
          },
        });

        setOffer(responseEn.data.data);
        
        // Set English content
        formik.setFieldValue("offer_title_english", responseEn.data.data.title);
        formik.setFieldValue("offer_description_english", responseEn.data.data.description);
        formik.setFieldValue("offer_highlights_english", responseEn.data.data.offer_highlights);
        formik.setFieldValue("offer_inclusions_english", responseEn.data.data.offer_inclusions);
        formik.setFieldValue("offer_exclusions_english", responseEn.data.data.offer_exclusions);
        formik.setFieldValue("offer_cancel_policy_english", responseEn.data.data.offer_cancel_policy);
        formik.setFieldValue("offer_know_before_go_english", responseEn.data.data.offer_terms_conditions);

        // Set Arabic content
        formik.setFieldValue("offer_title_arabic", responseAr.data.data.title);
        formik.setFieldValue("offer_description_arabic", responseAr.data.data.description);
        formik.setFieldValue("offer_highlights_arabic", responseAr.data.data.offer_highlights);
        formik.setFieldValue("offer_inclusions_arabic", responseAr.data.data.offer_inclusions);
        formik.setFieldValue("offer_exclusions_arabic", responseAr.data.data.offer_exclusions);
        formik.setFieldValue("offer_cancel_policy_arabic", responseAr.data.data.offer_cancel_policy);
        formik.setFieldValue("offer_know_before_go_arabic", responseAr.data.data.offer_terms_conditions);

        const preloadedImages = (responseEn.data.data.offer_images || [])
          .filter(Boolean)
          .map((url, i) => {
            return Object.assign(new File([""], `image${i}.jpg`, { type: "image/jpeg" }), {
              preview: url
            });
          });
      
        formik.setFieldValue("offer_images", preloadedImages);
      } catch (error) {
        console.error('Error fetching offer:', error);
      }
    };
    fetchOffer();
  }, []);

    const handleFileChange = (files) => {
      files.forEach(file => {
        if (!file.preview && typeof file !== 'string') {
          URL.revokeObjectURL(file);
        }
      });
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

      // Add the _method=PUT parameter required by the API
      data.append('_method', 'PUT');
      data.append('cat_uid', formik.values.cat_uid);
      data.append('offer_price', formik.values.offer_price);
      data.append('offer_copouns_qty', formik.values.offer_copouns_qty);
      data.append('offer_end_date', formik.values.offer_end_date);
      data.append('coupon_end_date', formik.values.coupon_end_date);
      
      // Multi-language
      data.append('offer_title_english', formik.values.offer_title_english);
      data.append('offer_description_english', formik.values.offer_description_english);
      data.append('offer_highlights_english', formik.values.offer_highlights_english);
      data.append('offer_inclusions_english', formik.values.offer_inclusions_english);
      data.append('offer_exclusions_english', formik.values.offer_exclusions_english);
      data.append('offer_cancel_policy_english', formik.values.offer_cancel_policy_english);
      data.append('offer_know_before_go_english', formik.values.offer_know_before_go_english);
      
      data.append('offer_title_arabic', formik.values.offer_title_arabic);
      data.append('offer_description_arabic', formik.values.offer_description_arabic);
      data.append('offer_highlights_arabic', formik.values.offer_highlights_arabic);
      data.append('offer_inclusions_arabic', formik.values.offer_inclusions_arabic);
      data.append('offer_exclusions_arabic', formik.values.offer_exclusions_arabic);
      data.append('offer_cancel_policy_arabic', formik.values.offer_cancel_policy_arabic);
      data.append('offer_know_before_go_arabic', formik.values.offer_know_before_go_arabic);
      
      // offer_status and check availability
      data.append('offer_status', formik.values.offer_status);
      data.append('checkAvailability', formik.values.checkAvailability);
      data.append('offer_uid', id);
      data.append('sp_uid', formik.values.business_id);

    // Before sending form
    if (formik.values.branches_id.length === 0) {
      enqueueSnackbar('Please select at least one branch.', { variant: 'error' });
      return;
    }

    // Adjust branchesPayload based on API expectation (string "all" or JSON string array)
    const branchesPayload = formik.values.branches_id.includes('all')
      ? "all"
      : JSON.stringify(formik.values.branches_id.map(id => id.toString()));

    data.append('branches_id', branchesPayload);

      // Images - only append new File objects, not preloaded ones with a preview property
      formik.values.offer_images.forEach((file, index) => {
        // Check if it's a File object and not a preloaded file with a preview property
        if (file instanceof File && !file.preview) {
          data.append(`offer_image_${index + 1}`, file);
        }
      });
            
  
      const token = JSON.parse(localStorage.getItem(
        import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION
      ))?.access_token;
  
      console.log('Formik Values:', formik.values); // Log formik values
      // Log the contents of the FormData object
      console.log('FormData contents before sending:');
      for (let pair of data.entries()) {
        console.log(pair[0]+ ': ' + pair[1]);
      }

      console.log('Offer ID:', id); // Log the offer ID before the API call
      console.log('Posting to:', `${import.meta.env.VITE_APP_API_URL}/provider/offer/${id}/update`);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/provider/offer/${id}/update`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        });
      console.log('✅ Offer Created:', response.data);
      enqueueSnackbar('Offer created successfully!', { variant: 'success' });
      navigate('/Offers');
  
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
  };
  if (!offer) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
      </div>
    );
  }
  
  
  return (
<form className="w-full" onSubmit={formik.handleSubmit}>
        {/* Dashed Line Separator Between Steps */}

      {/* Stepper Body */}
      <div className="card-body p-1 ">
  <div  className="grid grid-cols-1 xl:grid-cols-2 gap-4">

    <div className="col-span-3 xl:col-span-2 card ">
      <div className="card-header">
        <h3 className="  card-title">Business Information</h3>
      </div>
      <div className="grid card-body grid-cols-2 gap-4">
        <div>
          <label className="form-label mb-1">Business Name</label>
          <BusinessSelect formik={formik}  />
        </div>
        <div className="col-span-1">
          <label className="form-label mb-1">Status</label>
          <select
            className="select"
            {...formik.getFieldProps('offer_status')}
          >
            <option value="">Select Status</option>
            <option value="1">Active</option>
            <option value="2">Pending</option>
            <option value="0">Inactive</option>
          </select>
          {formik.touched.offer_status && formik.errors.offer_status && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.offer_status}</p>
          )}
        </div>
        <div>
  <label className="form-label mb-1">Select Category</label>
  <CategorySelect formik={formik} typeId={formik.values.businessData?.type?.id || ''} />
  </div>
  <div>
    <label className="form-label mb-1">Price</label>
    <input
      className="input"
      {...formik.getFieldProps('offer_price')}
    />
    {formik.touched.offer_price && formik.errors.offer_price && (
      <p className="text-red-500 text-xs mt-1">{formik.errors.offer_price}</p>
    )}
  </div>
  <div>
          <label className="form-label mb-1">Coupon Quantity</label>
          <input
            className="input"
            {...formik.getFieldProps('offer_copouns_qty')}
          />
          {formik.touched.offer_copouns_qty && formik.errors.offer_copouns_qty && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.offer_copouns_qty}</p>
          )}
        </div>
        <div>
          <label className="form-label mb-1">Coupon Valid Date</label>
          <FlowbiteHtmlDatepicker
      value={formik.values.coupon_end_date}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      name="coupon_end_date" // ✅ important for Formik
      placeholder="Select Coupon Valid Date"
    />
    {formik.touched.coupon_end_date && formik.errors.coupon_end_date && (
      <p className="text-red-500 text-xs mt-1">{formik.errors.coupon_end_date}</p>
    )}
        </div>

        <div className="col-span-2 ">
  <label className="form-label mb-1">Offer Valid Date</label>
    <FlowbiteHtmlDatepicker
      value={formik.values.offer_end_date}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      name="offer_end_date" // ✅ important for Formik
      placeholder="Select Offer Valid Date"
    />
{formik.touched.offer_end_date && formik.errors.offer_end_date && (
  <p className="text-red-500 text-xs mt-1">{formik.errors.offer_end_date}</p>
)}
</div>

        
      </div>
    </div>
    {/* End of Business Information Card */}

    {/* branche and city card */}
    <div className="card col-span-2 ">
      <div className="card-header">
        <h3 className="card-title">Branches Where the Offer is Available</h3>
      </div>
      <div className="card-body grid grid-cols-1 gap-4">
        <div className="form-group">
          <label className="form-label mb-1">City</label>
          <CitySelect formik={formik} />
          {formik.touched.city_name && formik.errors.city_name && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.city_name}</p>
          )}
        </div>
        <div className="form-group">
          <label className="form-label mb-1">Branch</label>
          <BranchesSelect 
            providerId={formik.values.businessData?.id}
            offer={offer} 
            selectedCity={formik.values.city_name} 
            formik={formik} 
          />
          {formik.touched.branches_id && formik.errors.branches_id && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.branches_id}</p>
          )}
        </div>
      </div>
    </div>


    {/* Start of activity Card */}
    <div className="card   col-span-2 ">
  {/* Card Header */}
  <div className=" card-header ">
    <h3 className="card-title ">
      Availability Check
    </h3>
  </div>

  {/* Card Body */}
  <div className="flex card-body flex-col gap-4 ">
    {/* Toggle Section */}
    <div className="flex items-center justify-between">
      <h4 className="text-base font-medium  ">
        Require Availability Check
      </h4>
      <label className="flex switch items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="toggle toggle-sm"
          checked={formik.values.checkAvailability === 1}
          onChange={(e) => formik.setFieldValue('checkAvailability', e.target.checked ? 1 : 0)}
        />
      </label>
    </div>

    {/* Description Text */}
    <p className="text-sm  leading-relaxed">
      When clicked, the button in the mobile app will change to &ldquo;Check Availability&rdquo;. 
      Upon clicking, the user will be prompted to select a date, after which a request 
      will be sent to the service provider to confirm availability.
    </p>
  </div>
    </div>

    {/* End of activity Card */}
        {/* Basic Photos Card */}

        <div className="parent-cruds xl:col-span-2 col-span-3 card p-6">
          <div className="flex justify-center items-center dark:bg-gray-200 bg-gray-100 rounded-lg py-4 flex-col gap-y-4 mb-4">
            <label className="block text-sm font-medium mb-1">Offer Images (max 8)</label>
            <CrudMultiImageUpload 
              onFilesChange={(files) => {
                formik.setFieldValue("offer_images", files);
                handleFileChange(files); // optional cleanup
              }}
              initialFiles={formik.values.offer_images}
            
            />
            <p className="text-sm text-center text-gray-500 mt-1">
              Only *.png, *.jpg, and *.jpeg image files are accepted.
            </p>
          </div>
        </div>
    {/* Multi Language Content Card */}

        <div className="card col-span-2">
      <div className="card-header">
        <h3 className="card-title">
          Multi Language Content
        </h3>
      </div>
      <div className="card-body">
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
      <TabsList className="w-full mb-4">
          <Tab value="English" className="w-1/2 flex justify-center items-center gap-2">
            <img src={toAbsoluteUrl("/media/Flags-iso/us.svg")} alt="English" className="w-5 h-5" />
            English
          </Tab>
          <Tab value="Arabic" className="w-1/2 flex justify-center items-center gap-2">
            <img src={toAbsoluteUrl("/media/Flags-iso/sa.svg")} alt="Arabic" className="w-5 h-5" />
            العربية
          </Tab>
      </TabsList>
          <TabPanel value="English" className="grid  gap-4">
            <div className="form-group">
              <label className="form-label mb-1">Offer Title</label>
              <input type="text" className="input" {...formik.getFieldProps('offer_title_english')} />
              {formik.touched.offer_title_english && formik.errors.offer_title_english && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.offer_title_english}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label mb-1">Offer Description</label>
              <textarea className="textarea" {...formik.getFieldProps('offer_description_english')} />
              {formik.touched.offer_description_english && formik.errors.offer_description_english && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.offer_description_english}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label mb-1">Offer Highlight</label>
              <textarea className="textarea" {...formik.getFieldProps('offer_highlights_english')} />
              {formik.touched.offer_highlights_english && formik.errors.offer_highlights_english && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.offer_highlights_english}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label mb-1">Offer Inclusions</label>
              <textarea className="textarea" {...formik.getFieldProps('offer_inclusions_english')} />
              {formik.touched.offer_inclusions_english && formik.errors.offer_inclusions_english && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.offer_inclusions_english}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label mb-1">Offer Exclusions</label>
              <textarea className="textarea" {...formik.getFieldProps('offer_exclusions_english')} />
              {formik.touched.offer_exclusions_english && formik.errors.offer_exclusions_english && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.offer_exclusions_english}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label mb-1">Cancellation Policy</label>
              <textarea className="textarea" {...formik.getFieldProps('offer_cancel_policy_english')} />
              {formik.touched.offer_cancel_policy_english && formik.errors.offer_cancel_policy_english && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.offer_cancel_policy_english}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label mb-1">Terms & Conditions</label>
              <textarea className="textarea" {...formik.getFieldProps('offer_know_before_go_english')} />
              {formik.touched.offer_know_before_go_english && formik.errors.offer_know_before_go_english && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.offer_know_before_go_english}</p>
              )}
            </div>
          </TabPanel>
          <TabPanel value="Arabic" className="grid  gap-4">
            <div className="form-group">
              <label className="form-label mb-1">إسم العرض</label>
              <input type="text" className="input" {...formik.getFieldProps('offer_title_arabic')} />
              {formik.touched.offer_title_arabic && formik.errors.offer_title_arabic && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.offer_title_arabic}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label mb-1">وصف العرض</label>
              <textarea className="textarea" {...formik.getFieldProps('offer_description_arabic')} />
              {formik.touched.offer_description_arabic && formik.errors.offer_description_arabic && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.offer_description_arabic}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label mb-1"> مميزات العرض</label>
              <textarea className="textarea" {...formik.getFieldProps('offer_highlights_arabic')} />
              {formik.touched.offer_highlights_arabic && formik.errors.offer_highlights_arabic && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.offer_highlights_arabic}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label mb-1">العرض يشمل</label>
              <textarea className="textarea" {...formik.getFieldProps('offer_inclusions_arabic')} />
              {formik.touched.offer_inclusions_arabic && formik.errors.offer_inclusions_arabic && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.offer_inclusions_arabic}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label mb-1">استثناءات العرض</label>
              <textarea className="textarea" {...formik.getFieldProps('offer_exclusions_arabic')} />
              {formik.touched.offer_exclusions_arabic && formik.errors.offer_exclusions_arabic && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.offer_exclusions_arabic}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label mb-1">سياسة الإلغاء</label>
              <textarea className="textarea" {...formik.getFieldProps('offer_cancel_policy_arabic')} />
              {formik.touched.offer_cancel_policy_arabic && formik.errors.offer_cancel_policy_arabic && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.offer_cancel_policy_arabic}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label mb-1">الشروط والأحكام</label>
              <textarea className="textarea" {...formik.getFieldProps('offer_know_before_go_arabic')} />
              {formik.touched.offer_know_before_go_arabic && formik.errors.offer_know_before_go_arabic && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.offer_know_before_go_arabic}</p>
              )}
            </div>
          </TabPanel>
        </Tabs>
      </div>
      </div>
{/* end the parent card */}
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
  {loading ? 'Saving...' : 'Submit'}
</button>
</div>
</form>
  );
};

export  {EditOffersContent};