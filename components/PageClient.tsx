"use client"
import EditableContent from "./EditableContent";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import { FormatItalic, FormatUnderlined } from "@mui/icons-material";
import { ReactNode, useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { getSelectionDirection } from "@/utils/utils";
import { Box } from "@mui/material";
import { wrapInElement, selectionIsDescendentOfNode, generateQuery, selectionIsCoveredBy, createWrapper, unwrapSelectionFromQuery, resetSelectionToTextNodes, selectionHasTextNodes, getSelectionChildNodes, selectionContainsOnlyText, getButtonStatus, getRangeLowestAncestorElement, promoteChildrenOfNode, deleteEmptyElements, setSelection, moveSelection, getRangeChildNodes, getAncestorNode } from '@/utils/utils';
import StatefulBox from "./TestComponents/StatefulBox";
import MultiLevelBox from "./TestComponents/MultilLevelBox";
import UnderlineColor from "./TestComponents/UnderlineColor";
import { EditableContentContextProvider, useEditableContentContext } from "@/context/EditableContentContext";
import { HTMLWrapperInstructions, MUIButtonEditableContentButtonProps } from "./ContentEditableExperimentComponents";



declare global {
  interface Window {
    wrapInElement?: typeof wrapInElement;
    selectionIsDescendentOfNode?: typeof selectionIsDescendentOfNode;
    generateQuery?: typeof generateQuery;
    selectionIsCoveredBy?: typeof selectionIsCoveredBy;
    createWrapper?: typeof createWrapper;
    unwrapSelectionFromQuery?: typeof unwrapSelectionFromQuery;
    resetSelectionToTextNodes?: typeof resetSelectionToTextNodes;
    selectionHasTextNodes?: typeof selectionHasTextNodes;
    getSelectionChildNodes?: typeof getSelectionChildNodes;
    selectionContainsOnlyText?: typeof selectionContainsOnlyText;
    getButtonStatus?: typeof getButtonStatus;
    getRangeLowestAncestorElement?: typeof getRangeLowestAncestorElement;
    promoteChildrenOfNode?: typeof promoteChildrenOfNode;
    deleteEmptyElements?: typeof deleteEmptyElements;
    setSelection?: typeof setSelection;
    moveSelection?: typeof moveSelection;
    getRangeChildNodes?: typeof getRangeChildNodes;
    limitingContainer?: any;
    getAncestorNode?: typeof getAncestorNode;
    initialHTML?: string;
  }
}


const initialHTML = `
<strong>Lorem, ipsum</strong>
  ​dolor ​sit ​ 
  ​<i>amet  ​cons
  <strong>
    ectetur adipisicing ​ ​ ​
    <br>
    elit.
  </strong> ​Sunt,
</i>
repudiandae. ​Lorem, ipsum ​dolor ​sit ​amet ​ ​consectetur ​ ​ ​
<br>
adipisicing
<u testattribute="ta" testattribute2="ta2" data-unbreakable="">
  elit.
</u>
Sunt, ​re
<div 
  id="portal-container-2bf69a61-17c5-498f-ad4c-ba9a2b01132d" 
  data-button-key="react-button" 
  style="display: inline;"
>

    pud

      iand

    a

  e. ​ ​Lorem
</div>
, ​ipsum ​dolor ​ ​
<br>
sit amet
<strong>
  consectetur
  <i>
    adipisicing
  </i>
  elit.
</strong>
  Sunt,  ​repudiandae. ​Lorem, ​
​<div id="portal-container-f56a36a4-00b7-42c8-9d92-e14691b2ee1a" data-button-key="react-button" style="display: inline;">
  ipsum ​dolorsit
</div>`.replaceAll(/\n */g, '');



export default function PageClient() {


  const [changeTextDialogIsOpen, setChangeTextDialogIsOpen] = useState<boolean>(false)
  const [changeTextDialogText, setChangeTextDialogText] = useState<string>("Blah blah blah");
  const [changeTextSelectionDirection, setChangeTextSelectionDirection] = useState<"none" | "forward" | "backward">("none")
  const [changeTextAnchorNode, setChangeTextAnchorNode] = useState<Node | null>(null);
  const [changeTextAnchorOffset, setChangeTextAnchorOffset] = useState<number | null>(null);
  const [changeTextFocusNode, setChangeTextFocusNode] = useState<Node | null>(null);
  const [changeTextFocusOffset, setChangeTextFocusOffset] = useState<number | null>(null);

  const [underlineColor, setUnderlineColor] = useState("red");

  // utilities in window
  useEffect(function() {
    window.wrapInElement = wrapInElement;
    window.selectionIsDescendentOfNode = selectionIsDescendentOfNode;
    window.generateQuery = generateQuery;
    window.selectionIsCoveredBy = selectionIsCoveredBy;
    window.createWrapper = createWrapper;
    window.unwrapSelectionFromQuery = unwrapSelectionFromQuery;
    window.resetSelectionToTextNodes = resetSelectionToTextNodes;
    window.selectionHasTextNodes = selectionHasTextNodes;
    window.getSelectionChildNodes = getSelectionChildNodes;
    window.selectionContainsOnlyText = selectionContainsOnlyText;
    window.getButtonStatus = getButtonStatus;
    window.getRangeLowestAncestorElement = getRangeLowestAncestorElement;
    window.promoteChildrenOfNode = promoteChildrenOfNode;
    window.deleteEmptyElements = deleteEmptyElements;
    window.setSelection = setSelection;
    window.moveSelection = moveSelection;
    window.getRangeChildNodes = getRangeChildNodes;
    window.limitingContainer = document.querySelector("[contenteditable]")
    window.getAncestorNode = getAncestorNode;
    window.initialHTML = initialHTML;
  }, [])

  const { selectionToString, contentRefCurrentInnerHTML} = useEditableContentContext();

  return (
    <>  

        <Dialog
          open={changeTextDialogIsOpen}
          onClose={() => {setChangeTextDialogIsOpen(false)}}
          // disableRestoreFocus
        >
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogContent>
            Change the selected text!
            <TextField
              // autoFocus
              value={changeTextDialogText}
              onChange={(e) => {setChangeTextDialogText(e.target.value)}}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) => {
                setChangeTextDialogIsOpen(false);
                const selectionUpdateRange = new Range();

                if (!changeTextAnchorNode || !changeTextFocusNode) return;
                if (changeTextAnchorOffset === null || changeTextFocusOffset === null) return;

                if (changeTextSelectionDirection === "backward") {
                  selectionUpdateRange.setEnd(changeTextAnchorNode, changeTextAnchorOffset);
                  selectionUpdateRange.setStart(changeTextFocusNode, changeTextFocusOffset);
                } else {
                  selectionUpdateRange.setStart(changeTextAnchorNode, changeTextAnchorOffset);
                  selectionUpdateRange.setEnd(changeTextFocusNode, changeTextFocusOffset);
                }

                selectionUpdateRange.extractContents();
                const newTextNode = document.createTextNode(changeTextDialogText);
                selectionUpdateRange.insertNode(newTextNode);

                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(selectionUpdateRange);
              }}
            >
              Change Text
            </Button>
          </DialogActions>

        </Dialog>
        <EditableContent 
          initialHTML={initialHTML}
          // buttonRowStyle={{width: "70%", margin: "auto"}}
          divStyle={{
            width: "100%",
            height: "250px",
            margin: "auto",
            border: "2px solid black",
            overflowY: "scroll"
          }}
          editTextButtons={[
            {
              isMUIButton: true,
              dataKey: "callback-sample",
              child: "CB",
              wrapperArgs: {
                element: "strong"
              },
              selectCallback: () => {
                const selection = window.getSelection();
                if (!selection) return;
                const {anchorNode, anchorOffset, focusNode, focusOffset} = selection;
                setChangeTextSelectionDirection(getSelectionDirection(selection) || "none")
                setChangeTextDialogText(selection?.toString() || "")
                setChangeTextDialogIsOpen(true);
                setChangeTextAnchorNode(anchorNode);
                setChangeTextAnchorOffset(anchorOffset);
                setChangeTextFocusNode(focusNode);
                setChangeTextFocusOffset(focusOffset);
              }
            },
            {
              isMUIButton: true, 
              dataKey: "bold",
              child: <FormatBoldIcon/>,
              // variant: "contained",
              wrapperArgs: {
                element: "strong"
              }
              // deselectedVariant: "",
              // selectedVariant: "outlined"

            },
            {
              isMUIButton: true, 
              dataKey: "italics",
              child: <FormatItalic/>,
              // variant: "contained",
              wrapperArgs: {
                element: "i"
              },
              // selectedVariant: "contained",
              // deselectedVariant: "outlined"
            },
            {
              isMUIButton: true, 
              dataKey: "underlined",
              child: <FormatUnderlined/>,
              // variant: "contained",
              wrapperArgs: {
                element: "u",
                attributes: {
                  testAttribute: "ta",
                  testAttribute2: "ta2",
                },
                eventListeners: {
                  click: function() {
                    console.log("clicked");
                  }
                },
                unbreakable: true
              }
            },
            {
              isMUIButton: true,
              dataKey: "react-button",
              child: "RB",
              isReactComponent: true, 
              component: <Box 
                component="div"
                sx={{
                  display: 'inline',
                  p: 1,
                  m: 1,
                  bgcolor: '#fff',
                  color: 'grey.800',
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: '700',
                }}
              /> 
            },
            {
              isMUIButton: true,
              dataKey: "stateful-component",
              child: "SC",
              isReactComponent: true,
              isStateful: true,
              component: <StatefulBox />
            },
            {
              isMUIButton: true,
              dataKey: "multilevel-component",
              child: "MLB",
              isReactComponent: true,
              isStateful: false,
              component: <MultiLevelBox />
            },
            {
              isMUIButton: true,
              dataKey: "underline-color",
              child: "UC",
              isReactComponent: true,
              isStateful: false,
              component: <UnderlineColor color={underlineColor} />
            }
          ]}
        />
        <ClearButton />
        <GetDehydratedHTMLButton />
        <div>
          <p>
            <span>Selection: </span>
            {selectionToString}
          </p>
        </div>
        <div>
          <p>
            <span>ContentRef.current Inner HTML: </span>
            {contentRefCurrentInnerHTML}
          </p>
        </div>

    </>
  )
}

function ClearButton() {
  const {contentRef, setContentRefCurrentInnerHTML} = useEditableContentContext();

  function clear() {
    console.log(contentRef?.current);
    if (contentRef.current) {
      contentRef.current.innerHTML = ""; // this does not change the state
      setContentRefCurrentInnerHTML("");
    }
  }

  return (
    <Button onClick={clear}>
      Clear
    </Button>
  )
}

function GetDehydratedHTMLButton() {
  const { getDehydratedHTML } = useEditableContentContext();

  function logDehydratedHTML (dehydratedHTML: string) {
    console.log(dehydratedHTML);
  }

  return (
    <Button onClick={() => { getDehydratedHTML(logDehydratedHTML) }}>
      Log Dehyrated HTML
    </Button>
  )
}