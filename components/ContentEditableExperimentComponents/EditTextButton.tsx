import { Button } from "@mui/material";
import { EditTextButtonProps } from ".";



export default function EditTextButton({
  isMUIButton, 
  dataKey, 
  child, 
  // defaultColor, 
  // selectedColor, 
  contentRef, 
  onClick, 
  selected,
  selectedVariant,
  deselectedVariant,
  wrapperArgs : {element, classList, id}, 
  ...remainderProps}: EditTextButtonProps
) {

  return (
    isMUIButton ? 
      <Button 
        onClick={onClick}
        variant={selected ? 
          (selectedVariant || "contained") : 
          (deselectedVariant || "outlined")
        }
        // Only pass valid MUI Button props here
        {...(remainderProps as React.ComponentProps<typeof Button>)}
      >
        {child}
      </Button> :
      <button
        onClick={onClick}
        id={id}
        className={classList?.join(" ")}
        {...remainderProps}
      >
        {child}
      </button>
  )
}



