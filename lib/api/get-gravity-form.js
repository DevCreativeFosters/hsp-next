import { AddressFieldFragment } from '@lib/api/gf-fragments/address-field';
import { DateFieldFragment } from '@lib/api/gf-fragments/date-field';
import { EmailFieldFragment } from '@lib/api/gf-fragments/email-field';
import { FileUploadFieldFragment } from '@lib/api/gf-fragments/file-upload-field';
import { HiddenFieldFragment } from '@lib/api/gf-fragments/hidden-field';
import { HtmlFieldFragment } from '@lib/api/gf-fragments/html-field';
import { NameFieldFragment } from '@lib/api/gf-fragments/name-field';
import { PhoneFieldFragment } from '@lib/api/gf-fragments/phone-field';
import { RadioFieldFragment } from '@lib/api/gf-fragments/radio-field';
import { SelectFieldFragment } from '@lib/api/gf-fragments/select-field';
import { TextAreaFieldFragment } from '@lib/api/gf-fragments/text-area-field';
import { TextFieldFragment } from '@lib/api/gf-fragments/text-field';
import { fetchAPI } from '@lib/fetch-api';

export async function getGravityForm(id) {
  const query = /* GraphQL */ `
    ${AddressFieldFragment}
    ${DateFieldFragment}
    ${EmailFieldFragment}
    ${HiddenFieldFragment}
    ${HtmlFieldFragment}
    ${NameFieldFragment}
    ${PhoneFieldFragment}
    ${RadioFieldFragment}
    ${SelectFieldFragment}
    ${TextAreaFieldFragment}
    ${TextFieldFragment}
    ${FileUploadFieldFragment}

    query GravityForm($id: ID!) {
      gfForm(id: $id, idType: DATABASE_ID) {
        id
        cssClass
        databaseId
        dateCreated
        title
        description
        #formId
        formFields {
          nodes {
            layoutGridColumnSpan
            databaseId
            type
            ...AddressFieldFragment
            ...DateFieldFragment
            ...EmailFieldFragment
            ...HiddenFieldFragment
            ...HtmlFieldFragment
            ...NameFieldFragment
            ...PhoneFieldFragment
            ...RadioFieldFragment
            ...SelectFieldFragment
            ...TextAreaFieldFragment
            ...TextFieldFragment
            ...FileUploadFieldFragment
          }
        }
      }
    }
  `;

  return await fetchAPI(query, {
    variables: {
      id: id,
    },
  });
}
