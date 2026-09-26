import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import * as esm from '@aviala-design/spiral';
import {generateTheme} from '@aviala-design/tokens';
const require=createRequire(import.meta.url);
const cjs=require('@aviala-design/spiral');
for(const ui of [esm,cjs]){
 assert.ok(ui.Rate && ui.RateIcon);
 const markup=renderToStaticMarkup(React.createElement(ui.Rate,{value:2.5,allowHalf:true,name:'score'}));
 assert.match(markup,/aria-valuenow="2.5"/);
 assert.equal((markup.match(/data-status="half"/g)||[]).length,1);
 const tokens=readFileSync(import.meta.resolve('@aviala-design/tokens/component-tokens.css').replace('file:///',''),'utf8');
 for(const size of ['default','small','big'])for(const type of ['star','like'])for(const status of ['empty','half','fill']){
  const html=renderToStaticMarkup(React.createElement(ui.RateIcon,{size,type,status}));
  for(const [,name]of html.matchAll(/var\((--rate-icon-[a-z-]+)\)/g))assert.ok(tokens.includes(name+':'),name);
 }
}
for(const api of [{generateTheme},require('@aviala-design/tokens')]){
 const vars=api.generateTheme({mode:'light'});
 assert.equal(vars['--rate-icon-color-like-half-selected-default'],'var(--box-box-theme-primary-default)');
 assert.equal(vars['--rate-icon-size-big-like-half-mask-width'],'11px');
}
const css=readFileSync(new URL(import.meta.resolve('@aviala-design/spiral/styles.css')),'utf8');
assert.ok(readFileSync(new URL(import.meta.resolve('@aviala-design/tokens/information-collect-extras.css')),'utf8').includes('.aviala-rate-icon__mask'));
assert.ok(css.includes('--select-menu-color-shadow-default'));
console.log('Installed packages: ESM/CJS Rate SSR, all 18 RateIcon token bindings, runtime Like values and CSS passed.');


const readCss = name => readFileSync(new URL(import.meta.resolve('@aviala-design/tokens/'+name+'.css')),'utf8');
const list=readCss('list-effects');
assert.ok(list.includes('--_list-divider-border: var(--list-item-color-divider-border-neutral-2-default)'));
assert.ok(list.includes('--_list-divider-border: var(--list-item-color-divider-border-neutral-3-default)'));
assert.ok(!list.includes('border-top-left-radius'));
const avatar=readCss('information-display-extras');
for(const level of ['display','headline1','headline2','title','subtitle','text'])assert.ok(avatar.includes('--_avatar-size: var(--avata-size-'+level+'-height)'));
for(const ui of [esm,cjs]){
 const alert=renderToStaticMarkup(React.createElement(ui.Alert,{title:'Title',quickAction:'Quick',action:'Action',secondaryAction:'Secondary',showActions:true}));
 assert.equal((alert.match(/data-mode="noBackgroundCustom"/g)||[]).length,4);
 assert.ok(!alert.includes('data-mode="noBackground"'));
}
console.log('Current installed ListItem, Alert and Avatar alignment checks passed.');

for (const ui of [esm,cjs]) {
 assert.ok(ui.MultiSelect && ui.ButtonGroup);
 const multi=renderToStaticMarkup(React.createElement(ui.MultiSelect,{options:[{value:'a',label:'Alpha'}],value:['a','missing'],name:'teams'}));
 assert.equal((multi.match(/type="hidden"/g)||[]).length,2);
 assert.match(multi,/value="missing"/);
 const group=renderToStaticMarkup(React.createElement(ui.ButtonGroup,{description:'Help'},React.createElement(ui.Button,null,'Save')));
 assert.match(group,/aviala-button-group__description/);
 assert.match(group,/aviala-typography--caption/);
 for (const Card of [ui.CardHead,ui.CardBottom]) assert.match(renderToStaticMarkup(React.createElement(Card,{slotType:'action'})),/aviala-button-group__buttons/);
}
const props=JSON.parse(readFileSync(new URL(import.meta.resolve('@aviala-design/spiral/props.json')),'utf8'));
assert.ok(props.MultiSelect && props.ButtonGroup);
const {loadAldTheme}=await import('@aviala-design/tokens/node');
for(const color of ['light','dark'])for(const density of ['default','mobile-friendly'])for(const effects of [true,false]){
 const vars=loadAldTheme(color,density,effects);
 const resolve=name=>{const value=vars[name], match=/^var\((--[^)]+)\)$/.exec(value);return match?resolve(match[1]):value;};
 assert.equal(resolve('--segmentator-button-size-nested-selected-shadow-blur'),'16px');
 assert.equal(resolve('--segmentator-button-color-nested-selected-shadow'),`rgb(0 0 0 / ${effects?0.06:0})`);
}
const basic=readCss('basic-input-effects');
assert.match(basic,/var\(--segmentator-shadow-selected,/);
assert.doesNotMatch(basic,/--segmentator-shadow-selected\s*:/);
assert.match(readCss('structure-navigation-extras'),/--button-group-color-placeholder-text-default/);
assert.match(readCss('input-effects'),/aviala-multi-select__tags/);
assert.match(readCss('information-collect-extras'),/data-loop="false"/);
assert.match(readCss('datepicker-effects'),/data-loop="false"/);
console.log('Current additions: ESM/CJS MultiSelect and ButtonGroup, Card reuse, props, eight-mode Nested shadow and boundary CSS passed.');

for(const ui of [esm,cjs]) {
 for(const Card of [ui.CardHead,ui.CardBottom]) {
  const html=renderToStaticMarkup(React.createElement(Card,{heading:'Heading',title:'Title',description:'Description',trailing:null}));
  assert.match(html,/aviala-typography--title/);
  assert.ok(html.indexOf('Heading')<html.indexOf('Title'));
  assert.ok(html.includes('Description'));
 }
 const enabled=renderToStaticMarkup(React.createElement(ui.TimePickerField,{showSeconds:true,defaultValue:{hours:9,minutes:5,seconds:7}}));
 const legacy=renderToStaticMarkup(React.createElement(ui.TimePickerField,{defaultValue:{hours:9,minutes:5,seconds:7}}));
 assert.match(enabled,/09:05:07/);
 assert.match(legacy,/09:05/);
 assert.doesNotMatch(legacy,/09:05:07/);
}
assert.match(readCss('structure-navigation-extras'),/--card-item-head-color-heading-default/);
assert.match(readCss('structure-navigation-extras'),/--card-item-bottom-color-heading-default/);
assert.match(readCss('datepicker-effects'),/--time-picker-menu-item-group-sec-size-content-gap/);
assert.match(readCss('datepicker-effects'),/data-seconds="true"/);
const stringProject={schemaVersion:1,id:'strings',draftRevision:0,collections:[{id:'c',name:'Strings',axis:'none',defaultModeId:'m',modes:[{id:'m',name:'Default'}]}],tokens:[{id:'t',collectionId:'c',path:['label'],layer:'foundation',type:'string',valuesByMode:{m:{kind:'literal',value:'Line\nA\tB'}}}],cssCompatibility:[]};
for(const api of [await import('@aviala-design/tokens/project'),require('@aviala-design/tokens/project')]) {
 assert.equal(api.projectCssVariables(stringProject)['--label'],'"Line\\a A\\9 B"');
}
console.log('Installed Card heading, TimePicker seconds and canonical CSS string escaping passed in ESM/CJS.');

for(const ui of [esm,cjs]) {
 const header=renderToStaticMarkup(React.createElement(ui.TableHead,{leftIcon:React.createElement('span',null,'Left'),rightIcon:React.createElement('span',null,'Right')},'Heading'));
 assert.equal((header.match(/class="aviala-table-head__icon-slot"/g)||[]).length,2);
 assert.ok(header.indexOf('Left')<header.indexOf('Heading') && header.indexOf('Heading')<header.indexOf('Right'));
 assert.doesNotMatch(header,/leftIcon=|rightIcon=/);
}
assert.match(readCss('information-display-extras'),/--table-head-color-icon-default/);
for(const api of [await import('@aviala-design/tokens/project'),require('@aviala-design/tokens/project')]) {
 const project={...stringProject,id:'units',tokens:[
  {id:'font',collectionId:'c',path:['size','small'],layer:'foundation',type:'number',unit:'px',valuesByMode:{m:{kind:'literal',value:12}}},
  {id:'spacing',collectionId:'c',path:['padding','small'],layer:'foundation',type:'number',unit:'px',valuesByMode:{m:{kind:'literal',value:6}}}
 ]};
 const before=JSON.stringify(project);
 assert.deepEqual({...api.projectCssVariables(project,{},api.avialaProjectCssOptions(project))},{'--size-small':'0.75rem','--padding-small':'6px'});
 assert.equal(api.projectCssVariables(project)['--size-small'],'12px');
 assert.equal(JSON.stringify(project),before);
}
console.log('Installed TableHead icon slots and opt-in Aviala typography profile passed in ESM/CJS.');
