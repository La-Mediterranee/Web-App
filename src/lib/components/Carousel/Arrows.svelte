<script>


const LeftArrow = ({
  customLeftArrow,
  getState,
  previous,
  disabled
}: LeftArrowProps): HTMLElement=> {
  if (customLeftArrow) {
    return React.cloneElement(customLeftArrow, {
      onClick: () => previous(),
      carouselState: getState(),
      disabled: disabled
    });
  }

  return (

  );
};
const RightArrow = ({
  customRightArrow,
  getState,
  next,
  disabled
}: RightArrowProps): HTMLElement=> {
  if (customRightArrow) {
    return React.cloneElement(customRightArrow, {
      onClick: () => next(),
      carouselState: getState(),
      disabled: disabled
    });
  }

};
</script>
