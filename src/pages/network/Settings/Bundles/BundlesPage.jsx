import { Fragment } from 'react';
import { Container } from '@/components/container';
import { BundlesContent } from '.';
import { Toolbar,  ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { SettingsSidebarMenu } from '../SettingsSidebarMenu';


const BundlesPage = () => {
  const {
    currentLayout
  } = useLayout();

  return <Fragment>
  {currentLayout?.name === 'demo1-layout' && <Container>
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle />
        </ToolbarHeading>
      </Toolbar>
    </Container>}

      
    <Container className="grid grid-cols-5 gap-x-6 items-start">
        <SettingsSidebarMenu />
        <BundlesContent />
      </Container>
    </Fragment>;
};
export { BundlesPage };