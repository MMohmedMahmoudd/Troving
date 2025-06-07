import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage, Demo1DarkSidebarPage } from '@/pages/dashboards';
import {  NetworkGetStartedPage,BussinessPage,OffersPage,LocationsPage } from '@/pages/network';
import { AuthPage } from '@/auth';
import { RequireAuth } from '@/auth/RequireAuth';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { AddProviderPage } from '@/pages/network/get-started/AddProvider';
import { ProfileDefaultPage } from '@/pages/network/get-started/ProviderProfile';
import { AddBussinessPage } from '@/pages/network/Bussiness/AddBussiness';
import { BussinessDefaultPage } from '@/pages/network/Bussiness/BussinessProfile';
import { OfferProfileDefaultPage } from '@/pages/network/Offers/OfferProfile';
import { AddOffersPage } from '@/pages/network/Offers/AddOffers';
import { CitiesPage } from '@/pages/network/Locations/Cities';
import { AddCityPage } from '@/pages/network/Locations/Cities/AddCity';
import { ZonesPage } from '@/pages/network/Locations/Zones';
import { AddZonePage } from '@/pages/network/Locations/Zones/AddZone';
import { ReservationsPage } from '@/pages/network/Reservations';
import { ReservationDefaultPage } from '@/pages/network/Reservations/ReservationProfile';
import { BrancheDefaultPage } from '@/pages/network/Bussiness/BrancheProfile';
import { AddBrancheDefaultPage } from '@/pages/network/Bussiness/AddBranche';
import { AddReservationPage } from '@/pages/network/Reservations/AddReservation';
import { EditOffersPage } from '@/pages/network/Offers/EditOffer';
import { EditCityPage } from '@/pages/network/Locations/Cities/EditCity';
import { UsersPage } from '@/pages/network/Users';
import { AddUserPage } from '@/pages/network/Users/AddUser';
import { ProfileUserPage } from '@/pages/network/Users/UserProfile';
import { TeamPage } from '@/pages/network/Teams';
import { MemberProfilePage } from '@/pages/network/Teams/MemberProfile';
import { AddMemberPage } from '@/pages/network/Teams/AddMember';
import {  SettingsPage } from '@/pages/network/Settings';
import {  BundlesPage } from '@/pages/network/Settings/Bundles';
import {  AddBundlesPage } from '@/pages/network/Settings/Bundles/AddBundles';
import {  CategoriesPage } from '@/pages/network/Settings/Categories';
import {  AddCategoryPage } from '@/pages/network/Settings/Categories/AddCategory';
import { EditBundlePage } from '@/pages/network/Settings/Bundles/EditBundle';
import { EditCategoryPage } from '@/pages/network/Settings/Categories/EditCategory';
import { SupCategoriesPage } from '@/pages/network/Settings/SupCategories';
import { EditSupCategoryPage } from '@/pages/network/Settings/SupCategories';
import { AddSupCategoryPage } from '@/pages/network/Settings/SupCategories';
import { PaymentMethodPage } from '@/pages/network/Settings/PaymentMethod';
import { AddPaymentMethodPage } from '@/pages/network/Settings/PaymentMethod/AddPaymentMethod/AddPaymentMethodPage';
import { EditPaymentMethodPage } from '@/pages/network/Settings/PaymentMethod/EditPaymentMethod/EditPaymentMethodPage';

  const AppRoutingSetup = () => {
  return <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route path="/" element={<DefaultPage />} />
          <Route path="/dark-sidebar" element={<Demo1DarkSidebarPage />} />
          <Route path="/ProviderProfile/:id" element={<ProfileDefaultPage />} />
          <Route path="/businessprofile/:id" element={<BussinessDefaultPage />} />
          <Route path="/OfferProfile/:id" element={<OfferProfileDefaultPage />} />
          <Route path="/OfferProfile/:id" element={<OfferProfileDefaultPage />} />
          <Route path="/reservationprofile/:id" element={<ReservationDefaultPage />} />
          <Route path="/branchprofile/:id" element={<BrancheDefaultPage />} />
          <Route path="/addBranche/:id" element={<AddBrancheDefaultPage />} />
          <Route path="/EditOffer/:id" element={<EditOffersPage />} />
          <Route path="/EditCity/:id" element={<EditCityPage />} />
          <Route path="/UserProfile/:id" element={<ProfileUserPage />} />
          <Route path="/MemberProfile/:id" element={<MemberProfilePage />} />
          <Route path="/editbundle/:id" element={<EditBundlePage />} />
          <Route path="/editcategory/:id" element={<EditCategoryPage />} />
          <Route path="/editsubcategory/:id" element={<EditSupCategoryPage />} />
          <Route path="/editpaymentmethod/:id" element={<EditPaymentMethodPage />} />

          <Route path="/addpaymentmethod" element={<AddPaymentMethodPage />} />
          <Route path="/paymentmethod" element={<PaymentMethodPage />} />
          <Route path="/addsubcategory" element={<AddSupCategoryPage />} />
          <Route path="/subcategory" element={<SupCategoriesPage />} />
          <Route path="/AddCategory" element={<AddCategoryPage />} />
          <Route path="/maincategories" element={<CategoriesPage />} />
          <Route path="/AddBundles" element={<AddBundlesPage />} />
          <Route path="/Bundles" element={<BundlesPage />} />
          <Route path="/Settings" element={<SettingsPage />} />
          <Route path="/Teams" element={<TeamPage />} />
          <Route path="/AddMember" element={<AddMemberPage />} />
          <Route path="/Users" element={<UsersPage />} />
          <Route path="/AddUser" element={<AddUserPage />} />
          <Route path="/providers" element={<NetworkGetStartedPage />} />
          <Route path="/AddProvider" element={<AddProviderPage />} />
          <Route path="/bussiness" element={<BussinessPage />} />
          <Route path="/Addbussiness" element={<AddBussinessPage />} />
          <Route path="/Offers" element={<OffersPage />} />
          <Route path="/AddOffer" element={<AddOffersPage />} />
          <Route path="/Countries" element={<LocationsPage />} />
          <Route path="/Cities" element={<CitiesPage />} />
          <Route path="/addCity" element={<AddCityPage />} />
          <Route path="/Zones" element={<ZonesPage />} />
          <Route path="/AddZone" element={<AddZonePage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/addreservation" element={<AddReservationPage />} />

        </Route>
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>;
};
export { AppRoutingSetup };