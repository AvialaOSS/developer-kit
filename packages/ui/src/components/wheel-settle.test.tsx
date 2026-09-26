import {afterEach,expect,it,vi} from "vitest";
import type {ReactElement,ReactNode} from "react";
import {ScrollPickerColumn} from "./scroll-picker";
import {DatePickerTimeWheelColumn} from "./date-picker/date-picker-time-wheel";
import {WHEEL_SCROLL_END_MS} from "../lib/sticky-wheel";

// Exercise component callbacks with measured geometry, without a browser renderer.
vi.mock("react",async(importOriginal)=>({
 ...await importOriginal<typeof import("react")>(),
 useRef:(current:unknown)=>({current}),useId:()=>"wheel",
 useCallback:(callback:unknown)=>callback,useMemo:(factory:()=>unknown)=>factory(),
 useEffect:()=>{},useLayoutEffect:()=>{},
}));
function scroller(node:ReactNode):ReactElement<any>|undefined {
 if(!node || typeof node!=="object") return;
 if(Array.isArray(node)) return node.map(scroller).find(Boolean);
 const element=node as ReactElement<any>;
 return element.props?.onScroll ? element : scroller(element.props?.children);
}
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();});

it.each([{name:"ScrollPicker",Column:ScrollPickerColumn<number>},{name:"TimeWheel",Column:DatePickerTimeWheelColumn}].flatMap(column=>["Home","ArrowDown"].map(key=>({...column,key}))))(
 "$name releases $key without scrollend before the next user scroll",({Column,key})=>{
  vi.useFakeTimers();
  vi.stubGlobal("requestAnimationFrame",(callback:()=>void)=>{callback();return 0;});
  vi.stubGlobal("getComputedStyle",()=>({height:"36px"}));
  const onChange=vi.fn();
  const element=scroller(Column({values:[0,1,2],value:0,onChange,"aria-label":"Value",loop:false}))!;
  const items=[0,1,2].map(index=>({offsetTop:index*36,offsetHeight:36}));
  const container={scrollTop:0,scrollHeight:108,clientHeight:36,
   querySelectorAll:()=>items,querySelector:()=>items[0],
   scrollTo:({top}:{top:number})=>{container.scrollTop=top;},
  };
  element.props.ref.current=container;
  element.props.onKeyDown({key,preventDefault:vi.fn()});
  if(key==="ArrowDown") expect(onChange).toHaveBeenCalledWith(1);
  else expect(onChange).not.toHaveBeenCalled();
  onChange.mockClear();
  // A no-op Home does not produce a scroll event at all.
  if(key==="ArrowDown") element.props.onScroll();
  vi.advanceTimersByTime(WHEEL_SCROLL_END_MS);
  expect(onChange).not.toHaveBeenCalled();
  container.scrollTop=72;
  element.props.onScroll();
  vi.advanceTimersByTime(WHEEL_SCROLL_END_MS);
  expect(onChange).toHaveBeenCalledExactlyOnceWith(2);
 });
