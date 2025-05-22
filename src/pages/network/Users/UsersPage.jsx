import { Fragment } from 'react';
// import { Link } from 'react-router-dom';
import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription,ToolbarActions, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { UsersContent } from '.';
import { useLayout } from '@/providers';
import { Link } from 'react-router-dom';
const UsersPage = () => {
  const {
    currentLayout
  } = useLayout();
  return <Fragment>
      {currentLayout?.name === 'demo1-layout' && <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription></ToolbarDescription>
              </ToolbarHeading>
              <ToolbarActions>
              {/* <a href="#" className="btn btn-sm btn-light">
                Upload CSV
              </a> */}
              <Link to="/addprovider" className="btn btn-outline btn-primary cursor-pointer">
              Add User
                <i className="ki-filled ki-plus-squared"></i>
              </Link>
            </ToolbarActions>

          </Toolbar>
        </Container>}

      <Container>
        <UsersContent />
      </Container>
    </Fragment>;
};
export { UsersPage };