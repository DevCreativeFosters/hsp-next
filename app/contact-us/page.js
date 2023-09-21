import parse from 'html-react-parser';
import {
  getMenus,
  getGlobalOptions,
  getGravityForm,
  getPageData,
} from '@lib/api';
import Layout from '@components/layout/layout';
import Container from '@components/container/container';
import ContentBox from '@components/content-box/content-box';
import SectionIntro from '@components/section-intro/section-intro';
import PageGrid from '@components/page-grid/page-grid';
import Sidebar from '@components/sidebar/sidebar';
import Logo from '@assets/images/logo.svg';
import PageContainer from '@components/page-container/page-container';
import GravityForm from '@components/gravity-forms/gravity-form-provider';
import Button from '@components/button/button';

export default async function ContactUs() {
  const content = await getPageData('contact-us');
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();
  const contactUsForm = await getGravityForm(1);
  const contactUsInfo = globalOptions?.contactUsInfo;
  const servicesBox = globalOptions?.servicesBox || [];

  return (
    <Layout title="Contact Us" menus={menus} globalOptions={globalOptions}>
      <Container>
        <PageContainer>
          <SectionIntro
            title={content.title}
            description={content.content}
            fitInline
          />
          <PageGrid>
            <Sidebar>
              {contactUsInfo && (
                <ContentBox>
                  <Logo width="95" />
                  {parse(contactUsInfo)}
                </ContentBox>
              )}
              {servicesBox.length > 0 && (
                <ContentBox>
                  <h3>Services</h3>
                  <div>
                    {servicesBox.map((serviceLink, index) => {
                      const link = serviceLink.link;

                      return (
                        <Button
                          key={index}
                          href={link.url}
                          target={link.target}
                          variant="senary"
                          rightIcon="arrow-forward"
                        >
                          {link.title}
                        </Button>
                      );
                    })}
                  </div>
                </ContentBox>
              )}
            </Sidebar>
            <div>
              <GravityForm form={contactUsForm.gfForm} />
            </div>
          </PageGrid>
        </PageContainer>
      </Container>
    </Layout>
  );
}
