import { Container } from '@/components/container';
import { useLayout, useMenus } from '@/providers';
import { NavbarMenu } from '@/partials/menu/NavbarMenu';
import { Navbar } from '@/partials/navbar';
const PageNavbar = () => {
  const {
    getMenuConfig
  } = useMenus();
  const {
    currentLayout
  } = useLayout();
  const menuConfig = getMenuConfig('primary');
  const SettingsMenuConfig = menuConfig?.['8']?.children;
  if (SettingsMenuConfig && currentLayout?.name === 'demo1-layout') {
    return <Navbar>
        <Container className='px-0'>
          <NavbarMenu items={SettingsMenuConfig} />
        </Container>
      </Navbar>;
  } else {
    return <></>;
  }
};
export { PageNavbar };