import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const ChooseYourVehicle = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}ChooseYourVehicle${blockSuffix} {
      fieldGroupName
    }
  `;
};
