import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage, Demo1DarkSidebarPage } from '@/pages/dashboards';
import { ProfileActivityPage, ProfileBloggerPage, CampaignsCardPage, CampaignsListPage, ProjectColumn2Page, ProjectColumn3Page, ProfileCompanyPage, ProfileCreatorPage, ProfileCRMPage,  ProfileEmptyPage, ProfileFeedsPage, ProfileGamerPage, ProfileModalPage, ProfileNetworkPage, ProfileNFTPage, ProfilePlainPage, ProfileTeamsPage, ProfileWorksPage } from '@/pages/public-profile';
import { AccountActivityPage, AccountAllowedIPAddressesPage, AccountApiKeysPage, AccountAppearancePage, AccountBackupAndRecoveryPage, AccountBasicPage, AccountCompanyProfilePage, AccountCurrentSessionsPage, AccountDeviceManagementPage, AccountEnterprisePage, AccountGetStartedPage, AccountHistoryPage, AccountImportMembersPage, AccountIntegrationsPage, AccountInviteAFriendPage, AccountMembersStarterPage, AccountNotificationsPage, AccountOverviewPage, AccountPermissionsCheckPage, AccountPermissionsTogglePage, AccountPlansPage, AccountPrivacySettingsPage, AccountRolesPage, AccountSecurityGetStartedPage, AccountSecurityLogPage, AccountSettingsEnterprisePage, AccountSettingsModalPage, AccountSettingsPlainPage, AccountSettingsSidebarPage, AccountTeamInfoPage, AccountTeamMembersPage, AccountTeamsPage, AccountTeamsStarterPage, AccountUserProfilePage } from '@/pages/account';
import { NetworkAppRosterPage, NetworkMarketAuthorsPage , NetworkAuthorPage, NetworkGetStartedPage, NetworkMiniCardsPage, NetworkNFTPage, NetworkSocialPage, NetworkUserCardsTeamCrewPage, NetworkSaasUsersPage, NetworkStoreClientsPage, NetworkUserTableTeamCrewPage, NetworkVisitorsPage,BussinessPage,OffersPage,LocationsPage } from '@/pages/network';
import { AuthPage } from '@/auth';
import { RequireAuth } from '@/auth/RequireAuth';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { AuthenticationWelcomeMessagePage, AuthenticationAccountDeactivatedPage, AuthenticationGetStartedPage } from '@/pages/authentication';
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
import { ReservationDefaultPage } from '../pages/network/Reservations/ReservationProfile';
import { BrancheDefaultPage } from '@/pages/network/Bussiness/BrancheProfile';
import { AddBrancheDefaultPage } from '@/pages/network/Bussiness/AddBranche';
import { AddReservationPage } from '@/pages/network/Reservations/AddReservation';
import { EditOffersPage } from '@/pages/network/Offers/EditOffer';
import { EditCityPage } from '@/pages/network/Locations/Cities/EditCity';
import { UsersPage } from '@/pages/network/Users';
import { AddUserPage } from '@/pages/network/Users/AddUser';
import { ProfileUserPage } from '../pages/network/Users/UserProfile';
import { TeamPage } from '@/pages/network/Teams';
import { MemberProfilePage } from '@/pages/network/Teams/MemberProfile';
import { AddMemberPage } from '../pages/network/Teams/AddMember';
import {  SettingsPage } from '../pages/network/Settings';
import {  BundlesPage } from '../pages/network/Settings/Bundles';
import {  AddBundlesPage } from '../pages/network/Settings/Bundles/AddBundles';

  const AppRoutingSetup = () => {
  return <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route path="/" element={<DefaultPage />} />
          <Route path="/dark-sidebar" element={<Demo1DarkSidebarPage />} />
          <Route path="/public-profile/profiles/default" element={<ProfileDefaultPage />} />
          <Route path="/public-profile/profiles/creator" element={<ProfileCreatorPage />} />
          <Route path="/public-profile/profiles/company" element={<ProfileCompanyPage />} />
          <Route path="/public-profile/profiles/nft" element={<ProfileNFTPage />} />
          <Route path="/public-profile/profiles/blogger" element={<ProfileBloggerPage />} />
          <Route path="/public-profile/profiles/crm" element={<ProfileCRMPage />} />
          <Route path="/public-profile/profiles/gamer" element={<ProfileGamerPage />} />
          <Route path="/public-profile/profiles/feeds" element={<ProfileFeedsPage />} />
          <Route path="/public-profile/profiles/plain" element={<ProfilePlainPage />} />
          <Route path="/public-profile/profiles/modal" element={<ProfileModalPage />} />
          <Route path="/public-profile/projects/3-columns" element={<ProjectColumn3Page />} />
          <Route path="/public-profile/projects/2-columns" element={<ProjectColumn2Page />} />
          <Route path="/public-profile/works" element={<ProfileWorksPage />} />
          <Route path="/public-profile/teams" element={<ProfileTeamsPage />} />
          <Route path="/public-profile/network" element={<ProfileNetworkPage />} />
          <Route path="/public-profile/activity" element={<ProfileActivityPage />} />
          <Route path="/public-profile/campaigns/card" element={<CampaignsCardPage />} />
          <Route path="/public-profile/campaigns/list" element={<CampaignsListPage />} />
          <Route path="/public-profile/empty" element={<ProfileEmptyPage />} />
          <Route path="/account/home/get-started" element={<AccountGetStartedPage />} />
          <Route path="/account/home/user-profile" element={<AccountUserProfilePage />} />
          <Route path="/account/home/company-profile" element={<AccountCompanyProfilePage />} />
          <Route path="/account/home/settings-sidebar" element={<AccountSettingsSidebarPage />} />
          <Route path="/account/home/settings-enterprise" element={<AccountSettingsEnterprisePage />} />
          <Route path="/account/home/settings-plain" element={<AccountSettingsPlainPage />} />
          <Route path="/account/home/settings-modal" element={<AccountSettingsModalPage />} />
          <Route path="/account/billing/basic" element={<AccountBasicPage />} />
          <Route path="/account/billing/enterprise" element={<AccountEnterprisePage />} />
          <Route path="/account/billing/plans" element={<AccountPlansPage />} />
          <Route path="/account/billing/history" element={<AccountHistoryPage />} />
          <Route path="/account/security/get-started" element={<AccountSecurityGetStartedPage />} />
          <Route path="/account/security/overview" element={<AccountOverviewPage />} />
          <Route path="/account/security/allowed-ip-addresses" element={<AccountAllowedIPAddressesPage />} />
          <Route path="/account/security/privacy-settings" element={<AccountPrivacySettingsPage />} />
          <Route path="/account/security/device-management" element={<AccountDeviceManagementPage />} />
          <Route path="/account/security/backup-and-recovery" element={<AccountBackupAndRecoveryPage />} />
          <Route path="/account/security/current-sessions" element={<AccountCurrentSessionsPage />} />
          <Route path="/account/security/security-log" element={<AccountSecurityLogPage />} />
          <Route path="/account/members/team-starter" element={<AccountTeamsStarterPage />} />
          <Route path="/account/members/teams" element={<AccountTeamsPage />} />
          <Route path="/account/members/team-info" element={<AccountTeamInfoPage />} />
          <Route path="/account/members/members-starter" element={<AccountMembersStarterPage />} />
          <Route path="/account/members/team-members" element={<AccountTeamMembersPage />} />
          <Route path="/account/members/import-members" element={<AccountImportMembersPage />} />
          <Route path="/account/members/roles" element={<AccountRolesPage />} />
          <Route path="/account/members/permissions-toggle" element={<AccountPermissionsTogglePage />} />
          <Route path="/account/members/permissions-check" element={<AccountPermissionsCheckPage />} />
          <Route path="/account/integrations" element={<AccountIntegrationsPage />} />
          <Route path="/account/notifications" element={<AccountNotificationsPage />} />
          <Route path="/account/api-keys" element={<AccountApiKeysPage />} />
          <Route path="/account/appearance" element={<AccountAppearancePage />} />
          <Route path="/account/invite-a-friend" element={<AccountInviteAFriendPage />} />
          <Route path="/account/activity" element={<AccountActivityPage />} />
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

          <Route path="/network/user-cards/mini-cards" element={<NetworkMiniCardsPage />} />
          <Route path="/network/user-cards/team-crew" element={<NetworkUserCardsTeamCrewPage />} />
          <Route path="/network/user-cards/author" element={<NetworkAuthorPage />} />
          <Route path="/network/user-cards/nft" element={<NetworkNFTPage />} />
          <Route path="/network/user-cards/social" element={<NetworkSocialPage />} />
          <Route path="/network/user-table/team-crew" element={<NetworkUserTableTeamCrewPage />} />
          <Route path="/network/user-table/app-roster" element={<NetworkAppRosterPage />} />
          <Route path="/network/user-table/market-authors" element={<NetworkMarketAuthorsPage />} />
          <Route path="/network/user-table/saas-users" element={<NetworkSaasUsersPage />} />
          <Route path="/network/user-table/store-clients" element={<NetworkStoreClientsPage />} />
          <Route path="/network/user-table/visitors" element={<NetworkVisitorsPage />} />
          <Route path="/auth/welcome-message" element={<AuthenticationWelcomeMessagePage />} />
          <Route path="/auth/account-deactivated" element={<AuthenticationAccountDeactivatedPage />} />
          <Route path="/authentication/get-started" element={<AuthenticationGetStartedPage />} />
        </Route>
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>;
};
export { AppRoutingSetup };