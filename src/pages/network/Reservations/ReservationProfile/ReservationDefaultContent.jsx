import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { KeenIcon } from '@/components';
import { Modal } from '@/components/modal/Modal';
import { useSnackbar } from 'notistack';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[250px]">
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-primary"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  </div>
);

const ReservationDefaultContent = () => {
  const { id } = useParams();
  const [reservationData, setReservationData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponCodes, setCouponCodes] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchReservation = async () => {
    try {
      const token = JSON.parse(localStorage.getItem(
        import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION
      ))?.access_token;

      if (!token) throw new Error('Authentication token not found');

      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/reservation/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.data) {
        setReservationData(res.data.data);
        // Initialize coupon codes array based on the number of coupons if it's the initial fetch or num_coupons changed
        if (!couponCodes.length || couponCodes.length !== res.data.data.num_coupons) {
            setCouponCodes(Array(res.data.data.num_coupons).fill(''));
        }
      } else {
        throw new Error('Invalid reservation response');
      }
    } catch (error) {
      console.error('Failed to fetch reservation:', error.message || 'Failed to fetch reservation');
    }
  };

  useEffect(() => {
    if (id) fetchReservation();
  }, [id]); // Dependency array ensures this runs when id changes

  const handleAddCoupons = async () => {
    try {
      const token = JSON.parse(localStorage.getItem(
        import.meta.env.VITE_APP_NAME + '-auth-v' + import.meta.env.VITE_APP_VERSION
      ))?.access_token;

      if (!token) throw new Error('Authentication token not found');

      // Assuming an API endpoint for adding coupons
      // The body of the request might need adjustment based on the actual API
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/create/coupon`,
        { coupon_codes: couponCodes },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) {
        enqueueSnackbar('Coupons added successfully!', { variant: 'success' });
        setIsModalOpen(false);
        setCouponCodes(Array(reservationData.num_coupons).fill('')); // Clear inputs
        fetchReservation(); // Refresh reservation data
      } else {
        // Handle potential errors returned from the backend API
        enqueueSnackbar(res.data?.message || 'Failed to add coupons', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error adding coupons:', error);
      enqueueSnackbar('An error occurred while adding coupons.', { variant: 'error' });
    }
  };

  if ( !reservationData) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <h2 className="text-lg card-title mb-4">#{id}</h2>

      <div className="  card shadow-sm">
        <div className="card-header">
          <div className="flex flex-col  ">
            <p>Offer</p>
            <h3 className="card-title">{reservationData.offer_title}</h3>
          </div>
            <span className={`badge badge-outline ${reservationData.status === 'Active' ? 'badge-success' : reservationData.status === 'inactive' ? 'badge-danger' : reservationData.status === 'Waiting Payment' ? 'badge-primary' : 'badge-secondary'}`}>{reservationData.status}</span>
        </div>
        {/* Status badge */}

        {/* Offer Title */}
        
        {/* Provider Info */}
        <div className=" card-body  ">
          {/* Avatar */}
          <div className="flex items-center gap-4">
          <img
              src={reservationData.person_image || '/media/avatars/blank.png'}
              alt={reservationData.person_name}
              onError={(e) => {
                e.target.src = '/media/avatars/blank.png';
                e.target.onerror = null;
              }}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h3 className="card-title items-center flex gap-2 mb-1">{reservationData.person_name} <span className={`badge badge-sm badge-outline ${reservationData.provider?.[0]?.status === 'active' ? 'badge-success' : reservationData.provider?.[0]?.status === 'inactive' ? 'badge-danger' : reservationData.provider?.[0]?.status === 'Waiting Confirmation' ? 'badge-warning' : 'badge-secondary'}`}>{reservationData.provider?.[0]?.status}</span> </h3>
              <span className="text-md flex justify-center items-center gap-2 text-gray-500">
                <KeenIcon icon="phone" className=' h-4'/> <span className='flex justify-center items-center '>{reservationData.person_phone}</span>
                <KeenIcon icon="sms" className=' h-4'/> <span className='flex justify-center items-center '>{reservationData.person_email}</span>
              </span>
            </div>
          </div>  
          <div className="flex flex-wrap mt-4 gap-4 text-center">
            <div className="border-2 border-dashed p-3 rounded-lg min-w-[120px]">
              <div className="text-md  mb-1">Bussiness</div>
              <div className="font-semibold">{reservationData.sp_name}</div>
            </div>

            <div className="border-2 border-dashed p-3 rounded-lg min-w-[120px]">
              <div className="text-md  mb-1">Coupon Quantity</div>
              <div className="font-semibold">{reservationData.num_coupons}</div>
            </div>

            <div className="border-2 border-dashed p-3 rounded-lg min-w-[120px]">
              <div className="text-md  mb-1">Price</div>
              <div className="font-semibold">{reservationData.offer_price}</div>
            </div>

            <div className="border-2 border-dashed p-3 rounded-lg min-w-[120px]">
              <div className="text-md  mb-1">Coupon Valid Until</div>
              <div className="font-semibold">{reservationData.expired_at}</div>
            </div>
        </div>

        </div>
      </div>
      
      <h3 className='card-title text-lg my-4'>Reservation Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <h3 className='card-title'>Payment Summary</h3>
        </div>
        <div className="card-body">
          <div className="flex flex-col gap-2">
            <div className="flex w-full justify-between gap-2">
              <div className="text-md">Coupons</div>
              <div className="font-semibold">{reservationData.num_coupons} x {reservationData.offer_price}</div>
            </div>
            <div className="flex w-full justify-between gap-2">
              <div className="text-md">Subtotal</div>
              <div className="font-semibold">{reservationData.offer_price * reservationData.num_coupons}</div>
            </div>
            <div className="flex w-full justify-between gap-2">
              <div className="text-md">Troving Commission</div>
              <div className="font-semibold">{reservationData.commission_percentage}</div>
            </div>
            <div className="flex w-full justify-between gap-2">
              <div className="text-md">Total Payment</div>
              <div className="font-semibold">
              {(() => {
          const subtotal = reservationData.offer_price * reservationData.num_coupons;
          const commissionPercent = parseFloat(reservationData.commission_percentage.replace('%', '')) / 100;
          const commissionAmount = subtotal * commissionPercent;
          const totalPayment = subtotal - commissionAmount;
          return totalPayment.toFixed(2); // 2 decimal places
        })()}

              </div>
            </div>
            
          </div>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-header">
          <h3 className='card-title'>Arrival Date</h3>
        </div>
        <div className="card-body">
          <div className="card p-4">
            <div className="flex items-center gap-4">
            <div className="relative size-[50px] shrink-0">
                <svg
                  className="w-full h-full stroke-primary-clarity "
                  viewBox="0 0 44 48"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                >
                  <path d="M16 2.4641C19.7128 0.320509 24.2872 0.320508 28 2.4641L37.6506 8.0359C41.3634 10.1795 43.6506 14.141 43.6506
                          18.4282V29.5718C43.6506 33.859 41.3634 37.8205 37.6506 39.9641L28 45.5359C24.2872 47.6795 19.7128 47.6795 16 45.5359L6.34937
                          39.9641C2.63655 37.8205 0.349365 33.859 0.349365 29.5718V18.4282C0.349365 14.141 2.63655 10.1795 6.34937 8.0359L16 2.4641Z"
                  />
                  <path d="M16.25 2.89711C19.8081 0.842838 24.1919 0.842837 27.75 2.89711L37.4006 8.46891C40.9587 10.5232 43.1506
                          14.3196 43.1506 18.4282V29.5718C43.1506 33.6804 40.9587 37.4768 37.4006 39.5311L27.75 45.1029C24.1919
                          47.1572 19.8081 47.1572 16.25 45.1029L6.59937 39.5311C3.04125 37.4768 0.849365 33.6803 0.849365 29.5718V18.4282C0.849365
                          14.3196 3.04125 10.5232 6.59937 8.46891L16.25 2.89711Z"
                        stroke="#5C5E9B"
                        strokeOpacity="0.2"
                  />
                </svg>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <KeenIcon icon="calendar" className=" flex justify-center items-center text-[24px] text-[#5C5E9B]" />
                </div>
              </div>
            <h3 className='card-title'>{reservationData.booking_date}</h3>

            </div>
            <button className={`btn btn-outline ${reservationData.status === 'Waiting Confirmation' ? "btn-warning" : "btn-success"} flex justify-center items-center mt-4 border`} > {reservationData.status === 'Waiting Confirmation' ? "Edit Arrival Date" : "Confirmed"}</button>
          </div>
        </div>
      </div>
      </div>
      <div className="card mt-6 shadow-sm">
        <div className="card-header">
          <h3 className='card-title'>Coupons</h3>
        </div>
        <div className="card-body">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 gap-2">
              {reservationData.coupons && reservationData.coupons.length > 0 ? (
                reservationData.coupons.map((coupon, index) => (
                  <div key={index} className="flex justify-between w-full items-center">
                      <div className="flex flex-col">
                        <p className="text-md text-gray-600 ">Day of Use {coupon.day_of_use} </p>
                        <p className="font-semibold">{coupon.coupon}</p>
                      </div>
                    {coupon.is_used ? <KeenIcon icon='check-circle' className='text-success text-xl' /> : null}
                    </div>
                ))
              ) : (
                <p>There Are No Coupons Used</p>
              )}
              {reservationData.status === 'Active' && reservationData.coupons.length < reservationData.num_coupons ? (
                <button className='btn btn-outline btn-primary flex w-full justify-center mt-4' onClick={() => setIsModalOpen(true)}>
                  Add Coupon
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {/* Add Coupon Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="card  w-1/2 h-auto justify-center gap-4 " style={{ margin: 'auto', maxWidth: '500px' }}>
          <div className="card-header">
            <h2 className="card-title">Add Coupon</h2>
            <button onClick={() => setIsModalOpen(false)}><KeenIcon icon='cross-circle' className='text-xl'/> </button>
          </div>
          <div className="card-body ">
            {couponCodes.map((code, index) => (
              <div key={index} className={`form-control ${index > 0 ? 'mt-4' : ''}`}>
                <label className="label">
                  <span className="label-text">Coupon {index + 1}</span>
                </label>
                <input
                  type="tel"
                  placeholder={`Enter coupon code ${index + 1} like 9552652`}
                  className="input  w-full"
                  value={code}
                  onChange={(e) => {
                    const newCouponCodes = [...couponCodes];
                    newCouponCodes[index] = e.target.value;
                    setCouponCodes(newCouponCodes);
                  }}
                />
              </div>
            ))}
          </div>
          <div className="card-footer justify-end gap-4">
            <button className="btn border-1 border-gray-100 bg-transparent btn-secondary hover:border-0" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-outline btn-primary" onClick={handleAddCoupons}>Confirm</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

ReservationDefaultContent.propTypes = {
  reservation: PropTypes.shape({
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
    }),
    person_image: PropTypes.string,
    person_name: PropTypes.string,
    city: PropTypes.shape({
      name: PropTypes.string
    })
  }).isRequired
};

export { ReservationDefaultContent };