import { Fragment } from 'react';
import { Container } from '@/components/container';
import { UserProfileHero } from './heros';
import { MemberProfileContent } from '.';
import { useParams } from 'react-router-dom';
import { useEffect, useState,useRef  } from 'react';
import axios from 'axios';
import { Toolbar,  ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { useSnackbar } from 'notistack';


const MemberProfilePage = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const formikRef = useRef();
  const [formikMeta, setFormikMeta] = useState({ errors: {}, touched: {} });

  const {
    currentLayout
  } = useLayout();

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const token = JSON.parse(localStorage.getItem(import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION))?.access_token;
        const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/team/${id}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProvider(res.data.data);
      } catch (error) {
        console.error('Failed to fetch provider profile', error);
      }
    };
    fetchProvider();
  }, [id]);
  if (!provider) return <div className="flex justify-center items-center min-h-[250px]">
  <div
    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-primary"
    role="status"
  >
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
      Loading...
    </span>
  </div>
</div>



  return <Fragment>
  {currentLayout?.name === 'demo1-layout' && <Container>
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle />
        </ToolbarHeading>
      </Toolbar>
    </Container>}

<UserProfileHero
  formikErrors={formikMeta.errors}
  formikTouched={formikMeta.touched}

  initialImage={provider?.person?.person_image}
  name={provider?.person?.person_name}
  onImageChange={setSelectedImage}
  info={[
    { icon: 'sms', label: provider?.person?.person_email || '' },
    { icon: 'whatsapp', label: provider?.person?.person_mobile || '' }
  ]}
  person_status={provider?.person_status} // ✅ Send current status
  onStatusChange={async (newStatus) => {
    try {
      const token = JSON.parse(localStorage.getItem(
        import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION
      ))?.access_token;

      const updateData = {
        _method: 'PUT',
        person_status: parseInt(newStatus),
        person_name: provider?.person?.person_name,
        person_email: provider?.person?.person_email,
        person_mobile: provider?.person?.person_mobile,
        country_code: provider?.person?.country_code,
      };
        
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/team/${id}/update`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      enqueueSnackbar('User status updated successfully!', { variant: 'success' });
  
      // Update local state with numeric status
      setProvider(prev => ({
        ...prev,
        person: {
          ...prev.person,
          person_status: parseInt(newStatus)
        }
      }));
  
    } catch (error) {
      console.error('Failed to update user status:', error);
      enqueueSnackbar('Failed to update user status.', { variant: 'error' });
    }
  }}

/>
      
      <Container>
  <MemberProfileContent
    ref={formikRef}
    providerId={id}
    provider={provider}
    profileImage={selectedImage}
    setFormikMeta={setFormikMeta}

  />
      </Container>
    </Fragment>;
};
export { MemberProfilePage };