import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios back
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types'; // Import PropTypes
import { CrudAvatarUpload } from '../../Categories/AddCategory/CrudAvatarUpload';
import * as Yup from 'yup';

function EditPaymentMethodContent({ categoryData }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
        // Step 1
        name_en: '',
        name_ar: '',
            },
            
        validationSchema: Yup.object({
            name_en: Yup.string().required('English Name is required'),
            name_ar: Yup.string().required('Arabic Name is required'),
            }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const storedAuth = localStorage.getItem(import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION);
        const authData = storedAuth ? JSON.parse(storedAuth) : null;
        const token = authData?.access_token;

        if (!token) {
          // Error handled in parent or show a notification
          enqueueSnackbar('Authentication token not found.', { variant: 'error' });
          navigate('/auth/login');
          return;
        }

        // Update endpoint for categories
        const formData = new FormData();
        for (const key in values) {
          if (values[key] !== null && values[key] !== undefined) {
            formData.append(key, values[key]);
          }
        }
        formData.append('_method', 'PUT'); // Use _method=PUT for update

        const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/payment-methods/${categoryData.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.data.success) {
          enqueueSnackbar(`Payment Method ${values.name_en} updated successfully!`, { variant: 'success' });
          navigate('/paymentmethod'); // Navigate to the payment methods list page
        } else {
          // Handle API error - could pass a prop up or show notification
          enqueueSnackbar(response.data.message || 'Failed to update payment method', { variant: 'error' });
        }
      } catch (submitError) { // Renamed error to submitError to avoid conflict with prop
        console.error('Error updating paymentmethod:', submitError);
        // Handle submission error
        enqueueSnackbar(submitError.response?.data?.message || 'Error updating paymentmethod', { variant: 'error' });
    } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (categoryData) {
      formik.setValues({
        name_en: categoryData.name ,
        name_ar: categoryData.name_ar,

      });
    }
  }, [categoryData]);

  const handleFileChange = (file) => {
    console.log("Selected file:", file);
    formik.setFieldValue('image', file);
  };


  return (
    <div className='card'>
      <div className="card-header">
        <h2>Edit Category : {categoryData?.sp_type_title}</h2>
      </div>
      <div className='card-body'>
        <form onSubmit={formik.handleSubmit} className='grid grid-cols-2 gap-4'>
        <div className=" flex col-span-2 justify-center items-center dark:bg-gray-200 bg-gray-100 rounded-lg py-4 flex-col gap-y-4 mb-4">
      <label className="block text-sm font-medium mb-1">Main Category Logo  </label> 
      <CrudAvatarUpload onFileChange={handleFileChange} avatarURL={categoryData?.image} />
      {/* {errors.sp_image && <p className="text-red-500 text-sm mt-1">{errors.sp_image}</p>} */}

      <p className="text-sm text-center text-gray-500 mt-1">Only *.png, *.jpg, and *.jpeg image files are accepted.</p>
      </div>

      <div className="form-group col-span-1">
          <label htmlFor="name_en" className="form-label">Name English</label>
          <input
            type="text"
            id="name_en"
            className={`input ${formik.touched.name_en && formik.errors.name_en ? 'is-invalid' : ''}`}
            {...formik.getFieldProps('name_en')}
          />
          {formik.touched.name_en && formik.errors.name_en ? (
            <p role="alert" className="text-danger text-xs mt-1">{formik.errors.name_en}</p>
          ) : null}
        </div>

        <div className="form-group col-span-1">
          <label htmlFor="name_ar" className="form-label">Name Arabic</label>
          <input
            type="text"
            id="name_ar"
            className={`input ${formik.touched.name_ar && formik.errors.name_ar ? 'is-invalid' : ''}`}
            {...formik.getFieldProps('name_ar')}
          />
          {formik.touched.name_ar && formik.errors.name_ar ? (
            <p role="alert" className="text-danger text-xs mt-1">{formik.errors.name_ar}</p>
          ) : null}
        </div>



          <div className="col-span-2 flex justify-end items-center">
            <button type="submit" className='btn btn-outline btn-primary' disabled={loading}> 
                {loading ? 'Updating...':'Update Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditPaymentMethodContent.propTypes = {
  categoryData: PropTypes.object,
};

export { EditPaymentMethodContent};