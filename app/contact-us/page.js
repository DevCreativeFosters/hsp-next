import { getMenus, getGlobalOptions } from '@lib/api';
import Layout from '@components/layout/layout';
import Container from '@components/container/container';
import ContentBox from '@components/content-box/content-box';
import SectionIntro from '@components/section-intro/section-intro';
import PageGrid from '@components/page-grid/page-grid';
import Sidebar from '@components/sidebar/sidebar';
import Input from '@components/form/input';
import FormRow from '@components/form/form-row';
import Logo from '@assets/images/logo.svg';
import Form from '@components/form/form';
import PageContainer from '@components/page-container/page-container';
import Button from '@components/button';

export default async function ContactUs() {
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();

  return (
    <Layout title="Contact Us" menus={menus} globalOptions={globalOptions}>
      <Container>
        <PageContainer>
          <SectionIntro
            title="Contact Us"
            description={
              <>
                <div>Communication is key...</div>
                <div>
                  In this page, you will find any relevant communications that
                  may be relevant to our products.
                </div>
              </>
            }
            fitInline
          />
          <PageGrid>
            <Sidebar>
              <ContentBox>
                <Logo width="95" />
                <p>
                  1300 441 498 info@hsputelids.com 40 Overseas DriveNoble Park
                  North, VIC 3174
                </p>

                <p>
                  Mon - Thurs: 8am - 5.30pm Fri: 8.00am - 5.00pm Sat: 9.00am -
                  12.00pm
                </p>
              </ContentBox>

              <ContentBox>
                <h3>Services</h3>
                Register your product Find a local store
              </ContentBox>
            </Sidebar>
            <div>
              <Form withPadding withBackground>
                <h3>Request a callback</h3>
                <p>
                  Want to beef up your ride? The Ford Ranger PX Hard Lid is the
                  perfect meal ticket.
                </p>
                <FormRow>
                  <Input label="First name" required />
                  <Input label="Last name" required />
                </FormRow>
                <FormRow>
                  <Input label="E-mail" required />
                  <Input label="Phone" required />
                </FormRow>
                <FormRow>
                  <Input label="Location" required />
                </FormRow>
                <FormRow>
                  <Input type="textarea" label="Your message" required />
                </FormRow>
                <Button type="submit">Submit</Button>
              </Form>
            </div>
          </PageGrid>
        </PageContainer>
      </Container>
    </Layout>
  );
}
