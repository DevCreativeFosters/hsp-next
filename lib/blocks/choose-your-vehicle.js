import ChooseYourVehicleBlock from '@components/choose-your-vehicle-block/choose-your-vehicle-block';

export default function ChooseYourVehicleFlexibleBlock(
  makes,
  variants,
  params,
) {
  return (
    <ChooseYourVehicleBlock
      makes={makes}
      style="flexible"
      variants={variants}
      params={params}
    />
  );
}
