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
  const accountMenuConfig = menuConfig?.['9']?.children;
  if (accountMenuConfig && currentLayout?.name === 'demo1-layout') {
    return <Navbar>
        <Container className='ps-1'>
          <NavbarMenu items={accountMenuConfig} />
        </Container>
      </Navbar>;
  } else {
    return <></>;
  }
};
export { PageNavbar };