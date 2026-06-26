import { Fragment } from 'react';

import parse from 'html-react-parser';
import Image from 'next/image';

import { getGlobalOptions } from '@lib/api/get-global-options';
import { getPageData } from '@lib/api/get-page-data';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { renderBlock } from '@lib/block';
import { makeRelativeUrl, removeLeadingSlash } from '@lib/helpers';
import { prepareSchemas } from '@lib/prepare-schemas';
import routes from '@lib/routes';
import { metadata } from '@lib/seo';

import Button from '@components/button/button';
import Container from '@components/container/container';
import ContentBox from '@components/content-box/content-box';
import Layout from '@components/layout/layout';
import PageContainer from '@components/page-container/page-container';
import PageGrid from '@components/page-grid/page-grid';
import SectionIntro from '@components/section-intro/section-intro';
import Sidebar from '@components/sidebar/sidebar';

import Logo from '@assets/images/logo.png';

export async function generateMetadata() {
  const tags = [`page:${removeLeadingSlash(routes.contact)}`];
  const data = await getSeoByUri(routes.contact, tags);

  return {
    ...metadata,
    ...data,
  };
}

export default async function ContactUs() {
  const content = await getPageData('contact-us');
  const globalOptions = await getGlobalOptions();
  const contactUsInfo = globalOptions?.contactUsInfo;
  const servicesBox = globalOptions?.servicesBox || [];
  const contentBlocks = await Promise.all(
    content?.flexibleContent?.blocks?.map(renderBlock) || [],
  );

  // When WP returns null (which happens regularly during build when
  // the staging server hiccups) the JSX below dereferences
  // content.content / content.title and prerender crashes the whole
  // page out of the export. Bail early to an empty Layout shell —
  // the deploy survives; the page just renders blank for that build.
  if (!content) {
    return <Layout title="Contact Us" />;
  }

  return (
    <Layout title="Contact Us">
      {prepareSchemas(content?.schemaProSchemas)}
      <Container>
        <PageContainer>
          <SectionIntro
            description={content.content}
            fitInline
            title={content.title}
          />
          <PageGrid>
            <Sidebar>
              {contactUsInfo && (
                <ContentBox>
                  <Image alt={'HSP Logo'} height={36} src={Logo} width={95} />
                  {parse(contactUsInfo)}
                </ContentBox>
              )}
              {servicesBox.length > 0 && (
                <ContentBox>
                  <h3 className="h3">Services</h3>
                  <div>
                    {servicesBox.map((serviceLink, index) => {
                      const link = serviceLink.link;

                      if (link) {
                        return (
                          <Button
                            href={makeRelativeUrl(link?.url) || ''}
                            inlineOffsetByPadding
                            key={index}
                            rightIcon="arrow-forward"
                            target={link?.target}
                            variant="senary"
                          >
                            {link?.title}
                          </Button>
                        );
                      }

                      return null;
                    })}
                  </div>
                </ContentBox>
              )}
            </Sidebar>
            <div>
              {contentBlocks?.map((contentBlock, index) => (
                <Fragment key={index}>{contentBlock}</Fragment>
              ))}
            </div>
          </PageGrid>
        </PageContainer>
      </Container>
    </Layout>
  );
}
