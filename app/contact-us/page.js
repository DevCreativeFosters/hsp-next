import parse from 'html-react-parser';
import { getGlobalOptions, getPageData } from '@lib/api';
import Layout from '@components/layout/layout';
import Container from '@components/container/container';
import ContentBox from '@components/content-box/content-box';
import SectionIntro from '@components/section-intro/section-intro';
import PageGrid from '@components/page-grid/page-grid';
import Sidebar from '@components/sidebar/sidebar';
import PageContainer from '@components/page-container/page-container';
import Button from '@components/button/button';
import Logo from '@assets/images/logo.svg';
import { renderBlock } from '@lib/block';

export default async function ContactUs() {
  const content = await getPageData('contact-us');
  const globalOptions = await getGlobalOptions();
  const contactUsInfo = globalOptions?.contactUsInfo;
  const servicesBox = globalOptions?.servicesBox || [];
  const contentBlocks = content?.flexibleContent?.blocks?.map(renderBlock);

  return (
    <Layout title="Contact Us">
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
            <div>{contentBlocks?.map(contentBlock => contentBlock)}</div>
          </PageGrid>
        </PageContainer>
      </Container>
    </Layout>
  );
}
