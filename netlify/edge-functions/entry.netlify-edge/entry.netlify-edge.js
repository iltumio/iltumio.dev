/**
 * @license
 * @builder.io/qwik 0.9.0
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
const EMPTY_ARRAY$1 = [];
const EMPTY_OBJ$1 = {};
const isSerializableObject = (v) => {
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || null === proto;
};
const isObject = (v) => v && "object" == typeof v;
const isArray = (v) => Array.isArray(v);
const isString = (v) => "string" == typeof v;
const isFunction = (v) => "function" == typeof v;
const QSlot = "q:slot";
const isPromise = (value) => value instanceof Promise;
const safeCall = (call, thenFn, rejectFn) => {
  try {
    const promise = call();
    return isPromise(promise) ? promise.then(thenFn, rejectFn) : thenFn(promise);
  } catch (e) {
    return rejectFn(e);
  }
};
const then = (promise, thenFn) => isPromise(promise) ? promise.then(thenFn) : thenFn(promise);
const promiseAll = (promises) => promises.some(isPromise) ? Promise.all(promises) : promises;
const isNotNullable = (v) => null != v;
const delay = (timeout) => new Promise((resolve) => {
  setTimeout(resolve, timeout);
});
let _context;
const tryGetInvokeContext = () => {
  if (!_context) {
    const context = "undefined" != typeof document && document && document.__q_context__;
    if (!context) {
      return;
    }
    return isArray(context) ? document.__q_context__ = newInvokeContextFromTuple(context) : context;
  }
  return _context;
};
const getInvokeContext = () => {
  const ctx = tryGetInvokeContext();
  if (!ctx) {
    throw qError(QError_useMethodOutsideContext);
  }
  return ctx;
};
const useInvokeContext = () => {
  const ctx = getInvokeContext();
  if ("qRender" !== ctx.$event$) {
    throw qError(QError_useInvokeContext);
  }
  return ctx.$hostElement$, ctx.$waitOn$, ctx.$renderCtx$, ctx.$subscriber$, ctx;
};
const invoke = (context, fn, ...args) => {
  const previousContext = _context;
  let returnValue;
  try {
    _context = context, returnValue = fn.apply(null, args);
  } finally {
    _context = previousContext;
  }
  return returnValue;
};
const waitAndRun = (ctx, callback) => {
  const waitOn = ctx.$waitOn$;
  if (0 === waitOn.length) {
    const result = callback();
    isPromise(result) && waitOn.push(result);
  } else {
    waitOn.push(Promise.all(waitOn).then(callback));
  }
};
const newInvokeContextFromTuple = (context) => {
  const element = context[0];
  return newInvokeContext(void 0, element, context[1], context[2]);
};
const newInvokeContext = (hostElement, element, event, url) => ({
  $seq$: 0,
  $hostElement$: hostElement,
  $element$: element,
  $event$: event,
  $url$: url,
  $qrl$: void 0,
  $props$: void 0,
  $renderCtx$: void 0,
  $subscriber$: void 0,
  $waitOn$: void 0
});
const getWrappingContainer = (el) => el.closest("[q\\:container]");
const isNode = (value) => value && "number" == typeof value.nodeType;
const isDocument = (value) => value && 9 === value.nodeType;
const isElement = (value) => 1 === value.nodeType;
const isQwikElement = (value) => isNode(value) && (1 === value.nodeType || 111 === value.nodeType);
const isVirtualElement = (value) => 111 === value.nodeType;
const isModule = (module) => isObject(module) && "Module" === module[Symbol.toStringTag];
let _platform = (() => {
  const moduleCache = /* @__PURE__ */ new Map();
  return {
    isServer: false,
    importSymbol(containerEl, url, symbolName) {
      const urlDoc = ((doc, containerEl2, url2) => {
        var _a2;
        const baseURI = doc.baseURI;
        const base = new URL((_a2 = containerEl2.getAttribute("q:base")) != null ? _a2 : baseURI, baseURI);
        return new URL(url2, base);
      })(containerEl.ownerDocument, containerEl, url).toString();
      const urlCopy = new URL(urlDoc);
      urlCopy.hash = "", urlCopy.search = "";
      const importURL = urlCopy.href;
      const mod = moduleCache.get(importURL);
      return mod ? mod[symbolName] : import(importURL).then((mod2) => {
        return module = mod2, mod2 = Object.values(module).find(isModule) || module, moduleCache.set(importURL, mod2), mod2[symbolName];
        var module;
      });
    },
    raf: (fn) => new Promise((resolve) => {
      requestAnimationFrame(() => {
        resolve(fn());
      });
    }),
    nextTick: (fn) => new Promise((resolve) => {
      setTimeout(() => {
        resolve(fn());
      });
    }),
    chunkForSymbol() {
    }
  };
})();
const setPlatform = (plt) => _platform = plt;
const getPlatform = () => _platform;
const isServer$1 = () => _platform.isServer;
const directSetAttribute = (el, prop, value) => el.setAttribute(prop, value);
const directGetAttribute = (el, prop) => el.getAttribute(prop);
const ON_PROP_REGEX = /^(on|window:|document:)/;
const isOnProp = (prop) => prop.endsWith("$") && ON_PROP_REGEX.test(prop);
const addQRLListener = (listenersMap, prop, input) => {
  let existingListeners = listenersMap[prop];
  existingListeners || (listenersMap[prop] = existingListeners = []);
  for (const qrl of input) {
    const hash = qrl.$hash$;
    let replaced = false;
    for (let i = 0; i < existingListeners.length; i++) {
      if (existingListeners[i].$hash$ === hash) {
        existingListeners.splice(i, 1, qrl), replaced = true;
        break;
      }
    }
    replaced || existingListeners.push(qrl);
  }
  return false;
};
const setEvent = (listenerMap, prop, input) => {
  prop.endsWith("$");
  const qrls = isArray(input) ? input.map(ensureQrl) : [ensureQrl(input)];
  return prop = normalizeOnProp(prop.slice(0, -1)), addQRLListener(listenerMap, prop, qrls), prop;
};
const ensureQrl = (value) => isQrl$1(value) ? value : $(value);
const getDomListeners = (ctx, containerEl) => {
  const attributes = ctx.$element$.attributes;
  const listeners = {};
  for (let i = 0; i < attributes.length; i++) {
    const { name, value } = attributes.item(i);
    if (name.startsWith("on:") || name.startsWith("on-window:") || name.startsWith("on-document:")) {
      let array = listeners[name];
      array || (listeners[name] = array = []);
      const urls = value.split("\n");
      for (const url of urls) {
        const qrl = parseQRL(url, containerEl);
        qrl.$capture$ && inflateQrl(qrl, ctx), array.push(qrl);
      }
    }
  }
  return listeners;
};
const useSequentialScope = () => {
  const ctx = useInvokeContext();
  const i = ctx.$seq$;
  const hostElement = ctx.$hostElement$;
  const elCtx = getContext(hostElement);
  const seq = elCtx.$seq$ ? elCtx.$seq$ : elCtx.$seq$ = [];
  return ctx.$seq$++, {
    get: seq[i],
    set: (value) => seq[i] = value,
    i,
    ctx
  };
};
const useOn = (event, eventQrl) => _useOn(`on-${event}`, eventQrl);
const _useOn = (eventName, eventQrl) => {
  const invokeCtx = useInvokeContext();
  const ctx = getContext(invokeCtx.$hostElement$);
  addQRLListener(ctx.li, normalizeOnProp(eventName), [eventQrl]);
};
const getDocument = (node) => "undefined" != typeof document ? document : 9 === node.nodeType ? node : node.ownerDocument;
const jsx = (type, props, key) => {
  const processed = null == key ? null : String(key);
  return new JSXNodeImpl(type, props, processed);
};
class JSXNodeImpl {
  constructor(type, props, key = null) {
    this.type = type, this.props = props, this.key = key;
  }
}
const isJSXNode = (n) => n instanceof JSXNodeImpl;
const Fragment = (props) => props.children;
const SkipRender = Symbol("skip render");
const SSRComment = () => null;
const Virtual = (props) => props.children;
const InternalSSRStream = () => null;
const fromCamelToKebabCase = (text) => text.replace(/([A-Z])/g, "-$1").toLowerCase();
const setAttribute = (ctx, el, prop, value) => {
  ctx ? ctx.$operations$.push({
    $operation$: _setAttribute,
    $args$: [el, prop, value]
  }) : _setAttribute(el, prop, value);
};
const _setAttribute = (el, prop, value) => {
  if (null == value || false === value) {
    el.removeAttribute(prop);
  } else {
    const str = true === value ? "" : String(value);
    directSetAttribute(el, prop, str);
  }
};
const setProperty = (ctx, node, key, value) => {
  ctx ? ctx.$operations$.push({
    $operation$: _setProperty,
    $args$: [node, key, value]
  }) : _setProperty(node, key, value);
};
const _setProperty = (node, key, value) => {
  try {
    node[key] = value;
  } catch (err) {
    logError(codeToText(QError_setProperty), {
      node,
      key,
      value
    }, err);
  }
};
const createElement = (doc, expectTag, isSvg) => isSvg ? doc.createElementNS(SVG_NS, expectTag) : doc.createElement(expectTag);
const insertBefore = (ctx, parent, newChild, refChild) => (ctx.$operations$.push({
  $operation$: directInsertBefore,
  $args$: [parent, newChild, refChild || null]
}), newChild);
const appendChild = (ctx, parent, newChild) => (ctx.$operations$.push({
  $operation$: directAppendChild,
  $args$: [parent, newChild]
}), newChild);
const appendHeadStyle = (ctx, styleTask) => {
  ctx.$containerState$.$styleIds$.add(styleTask.styleId), ctx.$postOperations$.push({
    $operation$: _appendHeadStyle,
    $args$: [ctx.$containerState$.$containerEl$, styleTask]
  });
};
const _setClasslist = (elm, toRemove, toAdd) => {
  const classList = elm.classList;
  classList.remove(...toRemove), classList.add(...toAdd);
};
const _appendHeadStyle = (containerEl, styleTask) => {
  const doc = getDocument(containerEl);
  const isDoc = doc.documentElement === containerEl;
  const headEl = doc.head;
  const style = doc.createElement("style");
  directSetAttribute(style, "q:style", styleTask.styleId), style.textContent = styleTask.content, isDoc && headEl ? directAppendChild(headEl, style) : directInsertBefore(containerEl, style, containerEl.firstChild);
};
const removeNode = (ctx, el) => {
  ctx.$operations$.push({
    $operation$: _removeNode,
    $args$: [el, ctx]
  });
};
const _removeNode = (el, staticCtx) => {
  const parent = el.parentElement;
  if (parent) {
    if (1 === el.nodeType || 111 === el.nodeType) {
      const subsManager = staticCtx.$containerState$.$subsManager$;
      cleanupTree(el, staticCtx, subsManager, true);
    }
    directRemoveChild(parent, el);
  }
};
const createTemplate = (doc, slotName) => {
  const template = createElement(doc, "q:template", false);
  return directSetAttribute(template, QSlot, slotName), directSetAttribute(template, "hidden", ""), directSetAttribute(template, "aria-hidden", "true"), template;
};
const executeDOMRender = (ctx) => {
  for (const op of ctx.$operations$) {
    op.$operation$.apply(void 0, op.$args$);
  }
  resolveSlotProjection(ctx);
};
const getKey = (el) => directGetAttribute(el, "q:key");
const setKey = (el, key) => {
  null !== key && directSetAttribute(el, "q:key", key);
};
const resolveSlotProjection = (ctx) => {
  const subsManager = ctx.$containerState$.$subsManager$;
  ctx.$rmSlots$.forEach((slotEl) => {
    const key = getKey(slotEl);
    const slotChildren = getChildren(slotEl, "root");
    if (slotChildren.length > 0) {
      const sref = slotEl.getAttribute("q:sref");
      const hostCtx = ctx.$roots$.find((r) => r.$id$ === sref);
      if (hostCtx) {
        const template = createTemplate(ctx.$doc$, key);
        const hostElm = hostCtx.$element$;
        for (const child of slotChildren) {
          directAppendChild(template, child);
        }
        directInsertBefore(hostElm, template, hostElm.firstChild);
      } else {
        cleanupTree(slotEl, ctx, subsManager, false);
      }
    }
  }), ctx.$addSlots$.forEach(([slotEl, hostElm]) => {
    const key = getKey(slotEl);
    const template = Array.from(hostElm.childNodes).find((node) => isSlotTemplate(node) && node.getAttribute(QSlot) === key);
    template && (getChildren(template, "root").forEach((child) => {
      directAppendChild(slotEl, child);
    }), template.remove());
  });
};
class VirtualElementImpl {
  constructor(open, close) {
    this.open = open, this.close = close, this._qc_ = null, this.nodeType = 111, this.localName = ":virtual", this.nodeName = ":virtual";
    const doc = this.ownerDocument = open.ownerDocument;
    this.template = createElement(doc, "template", false), this.attributes = ((str) => {
      if (!str) {
        return /* @__PURE__ */ new Map();
      }
      const attributes = str.split(" ");
      return new Map(attributes.map((attr) => {
        const index2 = attr.indexOf("=");
        return index2 >= 0 ? [attr.slice(0, index2), (s = attr.slice(index2 + 1), s.replace(/\+/g, " "))] : [attr, ""];
        var s;
      }));
    })(open.data.slice(3)), open.data.startsWith("qv "), open.__virtual = this;
  }
  insertBefore(node, ref) {
    const parent = this.parentElement;
    if (parent) {
      const ref2 = ref || this.close;
      parent.insertBefore(node, ref2);
    } else {
      this.template.insertBefore(node, ref);
    }
    return node;
  }
  remove() {
    const parent = this.parentElement;
    if (parent) {
      const ch = Array.from(this.childNodes);
      this.template.childElementCount, parent.removeChild(this.open), this.template.append(...ch), parent.removeChild(this.close);
    }
  }
  appendChild(node) {
    return this.insertBefore(node, null);
  }
  insertBeforeTo(newParent, child) {
    const ch = Array.from(this.childNodes);
    newParent.insertBefore(this.open, child);
    for (const c of ch) {
      newParent.insertBefore(c, child);
    }
    newParent.insertBefore(this.close, child), this.template.childElementCount;
  }
  appendTo(newParent) {
    this.insertBeforeTo(newParent, null);
  }
  removeChild(child) {
    this.parentElement ? this.parentElement.removeChild(child) : this.template.removeChild(child);
  }
  getAttribute(prop) {
    var _a2;
    return (_a2 = this.attributes.get(prop)) != null ? _a2 : null;
  }
  hasAttribute(prop) {
    return this.attributes.has(prop);
  }
  setAttribute(prop, value) {
    this.attributes.set(prop, value), this.open.data = updateComment(this.attributes);
  }
  removeAttribute(prop) {
    this.attributes.delete(prop), this.open.data = updateComment(this.attributes);
  }
  matches(_) {
    return false;
  }
  compareDocumentPosition(other) {
    return this.open.compareDocumentPosition(other);
  }
  closest(query) {
    const parent = this.parentElement;
    return parent ? parent.closest(query) : null;
  }
  querySelectorAll(query) {
    const result = [];
    return getChildren(this, "elements").forEach((el) => {
      isQwikElement(el) && (el.matches(query) && result.push(el), result.concat(Array.from(el.querySelectorAll(query))));
    }), result;
  }
  querySelector(query) {
    for (const el of this.childNodes) {
      if (isElement(el)) {
        if (el.matches(query)) {
          return el;
        }
        const v = el.querySelector(query);
        if (null !== v) {
          return v;
        }
      }
    }
    return null;
  }
  get firstChild() {
    if (this.parentElement) {
      const first = this.open.nextSibling;
      return first === this.close ? null : first;
    }
    return this.template.firstChild;
  }
  get nextSibling() {
    return this.close.nextSibling;
  }
  get previousSibling() {
    return this.open.previousSibling;
  }
  get childNodes() {
    if (!this.parentElement) {
      return this.template.childNodes;
    }
    const nodes = [];
    let node = this.open;
    for (; (node = node.nextSibling) && node !== this.close; ) {
      nodes.push(node);
    }
    return nodes;
  }
  get isConnected() {
    return this.open.isConnected;
  }
  get parentElement() {
    return this.open.parentElement;
  }
}
const updateComment = (attributes) => `qv ${((map) => {
  const attributes2 = [];
  return map.forEach((value, key) => {
    var s;
    value ? attributes2.push(`${key}=${s = value, s.replace(/ /g, "+")}`) : attributes2.push(`${key}`);
  }), attributes2.join(" ");
})(attributes)}`;
const processVirtualNodes = (node) => {
  if (null == node) {
    return null;
  }
  if (isComment(node)) {
    const virtual = getVirtualElement(node);
    if (virtual) {
      return virtual;
    }
  }
  return node;
};
const getVirtualElement = (open) => {
  const virtual = open.__virtual;
  if (virtual) {
    return virtual;
  }
  if (open.data.startsWith("qv ")) {
    const close = findClose(open);
    return new VirtualElementImpl(open, close);
  }
  return null;
};
const findClose = (open) => {
  let node = open.nextSibling;
  let stack = 1;
  for (; node; ) {
    if (isComment(node)) {
      if (node.data.startsWith("qv ")) {
        stack++;
      } else if ("/qv" === node.data && (stack--, 0 === stack)) {
        return node;
      }
    }
    node = node.nextSibling;
  }
  throw new Error("close not found");
};
const isComment = (node) => 8 === node.nodeType;
const getRootNode = (node) => null == node ? null : isVirtualElement(node) ? node.open : node;
const createContext$1 = (name) => Object.freeze({
  id: fromCamelToKebabCase(name)
});
const useContextProvider = (context, newValue) => {
  const { get, set, ctx } = useSequentialScope();
  if (void 0 !== get) {
    return;
  }
  const hostElement = ctx.$hostElement$;
  const hostCtx = getContext(hostElement);
  let contexts = hostCtx.$contexts$;
  contexts || (hostCtx.$contexts$ = contexts = /* @__PURE__ */ new Map()), contexts.set(context.id, newValue), set(true);
};
const useContext = (context, defaultValue) => {
  const { get, set, ctx } = useSequentialScope();
  if (void 0 !== get) {
    return get;
  }
  const value = resolveContext(context, ctx.$hostElement$, ctx.$renderCtx$);
  if (void 0 !== value) {
    return set(value);
  }
  if (void 0 !== defaultValue) {
    return set(defaultValue);
  }
  throw qError(QError_notFoundContext, context.id);
};
const resolveContext = (context, hostElement, rctx) => {
  const contextID = context.id;
  if (rctx) {
    const contexts = rctx.$localStack$;
    for (let i = contexts.length - 1; i >= 0; i--) {
      const ctx = contexts[i];
      if (hostElement = ctx.$element$, ctx.$contexts$) {
        const found = ctx.$contexts$.get(contextID);
        if (found) {
          return found;
        }
      }
    }
  }
  if (hostElement.closest) {
    const value = queryContextFromDom(hostElement, contextID);
    if (void 0 !== value) {
      return value;
    }
  }
};
const queryContextFromDom = (hostElement, contextId) => {
  var _a2;
  let element = hostElement;
  for (; element; ) {
    let node = element;
    let virtual;
    for (; node && (virtual = findVirtual(node)); ) {
      const contexts = (_a2 = tryGetContext(virtual)) == null ? void 0 : _a2.$contexts$;
      if (contexts && contexts.has(contextId)) {
        return contexts.get(contextId);
      }
      node = virtual;
    }
    element = element.parentElement;
  }
};
const findVirtual = (el) => {
  let node = el;
  let stack = 1;
  for (; node = node.previousSibling; ) {
    if (isComment(node)) {
      if ("/qv" === node.data) {
        stack++;
      } else if (node.data.startsWith("qv ") && (stack--, 0 === stack)) {
        return getVirtualElement(node);
      }
    }
  }
  return null;
};
const ERROR_CONTEXT = createContext$1("qk-error");
const handleError = (err, hostElement, rctx) => {
  if (isServer$1()) {
    throw err;
  }
  {
    const errorStore = resolveContext(ERROR_CONTEXT, hostElement, rctx);
    if (void 0 === errorStore) {
      throw err;
    }
    errorStore.error = err;
  }
};
const executeComponent = (rctx, elCtx) => {
  elCtx.$dirty$ = false, elCtx.$mounted$ = true, elCtx.$slots$ = [];
  const hostElement = elCtx.$element$;
  const onRenderQRL = elCtx.$renderQrl$;
  const props = elCtx.$props$;
  const newCtx = pushRenderContext(rctx, elCtx);
  const invocatinContext = newInvokeContext(hostElement, void 0, "qRender");
  const waitOn = invocatinContext.$waitOn$ = [];
  newCtx.$cmpCtx$ = elCtx, invocatinContext.$subscriber$ = hostElement, invocatinContext.$renderCtx$ = rctx, onRenderQRL.$setContainer$(rctx.$static$.$containerState$.$containerEl$);
  const onRenderFn = onRenderQRL.getFn(invocatinContext);
  return safeCall(() => onRenderFn(props), (jsxNode) => (elCtx.$attachedListeners$ = false, waitOn.length > 0 ? Promise.all(waitOn).then(() => elCtx.$dirty$ ? executeComponent(rctx, elCtx) : {
    node: jsxNode,
    rctx: newCtx
  }) : elCtx.$dirty$ ? executeComponent(rctx, elCtx) : {
    node: jsxNode,
    rctx: newCtx
  }), (err) => (handleError(err, hostElement, rctx), {
    node: SkipRender,
    rctx: newCtx
  }));
};
const createRenderContext = (doc, containerState) => ({
  $static$: {
    $doc$: doc,
    $containerState$: containerState,
    $hostElements$: /* @__PURE__ */ new Set(),
    $operations$: [],
    $postOperations$: [],
    $roots$: [],
    $addSlots$: [],
    $rmSlots$: []
  },
  $cmpCtx$: void 0,
  $localStack$: []
});
const pushRenderContext = (ctx, elCtx) => ({
  $static$: ctx.$static$,
  $cmpCtx$: ctx.$cmpCtx$,
  $localStack$: ctx.$localStack$.concat(elCtx)
});
const serializeClass = (obj) => {
  if (isString(obj)) {
    return obj;
  }
  if (isObject(obj)) {
    if (isArray(obj)) {
      return obj.join(" ");
    }
    {
      let buffer = "";
      let previous = false;
      for (const key of Object.keys(obj)) {
        obj[key] && (previous && (buffer += " "), buffer += key, previous = true);
      }
      return buffer;
    }
  }
  return "";
};
const parseClassListRegex = /\s/;
const parseClassList = (value) => value ? value.split(parseClassListRegex) : EMPTY_ARRAY$1;
const stringifyStyle = (obj) => {
  if (null == obj) {
    return "";
  }
  if ("object" == typeof obj) {
    if (isArray(obj)) {
      throw qError(QError_stringifyClassOrStyle, obj, "style");
    }
    {
      const chunks = [];
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          value && chunks.push(fromCamelToKebabCase(key) + ":" + value);
        }
      }
      return chunks.join(";");
    }
  }
  return String(obj);
};
const getNextIndex = (ctx) => intToStr(ctx.$static$.$containerState$.$elementIndex$++);
const setQId = (rctx, ctx) => {
  const id = getNextIndex(rctx);
  ctx.$id$ = id, ctx.$element$.setAttribute("q:id", id);
};
const SKIPS_PROPS = [QSlot, "q:renderFn", "children"];
const serializeSStyle = (scopeIds) => {
  const value = scopeIds.join(" ");
  if (value.length > 0) {
    return value;
  }
};
const renderComponent = (rctx, ctx, flags) => {
  const justMounted = !ctx.$mounted$;
  const hostElement = ctx.$element$;
  const containerState = rctx.$static$.$containerState$;
  return containerState.$hostsStaging$.delete(hostElement), containerState.$subsManager$.$clearSub$(hostElement), then(executeComponent(rctx, ctx), (res) => {
    const staticCtx = rctx.$static$;
    const newCtx = res.rctx;
    const invocatinContext = newInvokeContext(hostElement);
    if (staticCtx.$hostElements$.add(hostElement), invocatinContext.$subscriber$ = hostElement, invocatinContext.$renderCtx$ = newCtx, justMounted) {
      if (ctx.$appendStyles$) {
        for (const style of ctx.$appendStyles$) {
          appendHeadStyle(staticCtx, style);
        }
      }
      if (ctx.$scopeIds$) {
        const value = serializeSStyle(ctx.$scopeIds$);
        value && hostElement.setAttribute("q:sstyle", value);
      }
    }
    const processedJSXNode = processData$1(res.node, invocatinContext);
    return then(processedJSXNode, (processedJSXNode2) => {
      const newVdom = wrapJSX(hostElement, processedJSXNode2);
      const oldVdom = getVdom(ctx);
      return then(visitJsxNode(newCtx, oldVdom, newVdom, flags), () => {
        ctx.$vdom$ = newVdom;
      });
    });
  });
};
const getVdom = (ctx) => (ctx.$vdom$ || (ctx.$vdom$ = domToVnode(ctx.$element$)), ctx.$vdom$);
class ProcessedJSXNodeImpl {
  constructor($type$, $props$, $children$, $key$) {
    this.$type$ = $type$, this.$props$ = $props$, this.$children$ = $children$, this.$key$ = $key$, this.$elm$ = null, this.$text$ = "";
  }
}
const wrapJSX = (element, input) => {
  const children = void 0 === input ? EMPTY_ARRAY$1 : isArray(input) ? input : [input];
  const node = new ProcessedJSXNodeImpl(":virtual", {}, children, null);
  return node.$elm$ = element, node;
};
const processData$1 = (node, invocationContext) => {
  if (null != node && "boolean" != typeof node) {
    if (isString(node) || "number" == typeof node) {
      const newNode = new ProcessedJSXNodeImpl("#text", EMPTY_OBJ$1, EMPTY_ARRAY$1, null);
      return newNode.$text$ = String(node), newNode;
    }
    if (isJSXNode(node)) {
      return ((node2, invocationContext2) => {
        const key = null != node2.key ? String(node2.key) : null;
        const nodeType = node2.type;
        const props = node2.props;
        const originalChildren = props.children;
        let textType = "";
        if (isString(nodeType)) {
          textType = nodeType;
        } else {
          if (nodeType !== Virtual) {
            if (isFunction(nodeType)) {
              const res = invoke(invocationContext2, nodeType, props, node2.key);
              return processData$1(res, invocationContext2);
            }
            throw qError(QError_invalidJsxNodeType, nodeType);
          }
          textType = ":virtual";
        }
        let children = EMPTY_ARRAY$1;
        return null != originalChildren ? then(processData$1(originalChildren, invocationContext2), (result) => (void 0 !== result && (children = isArray(result) ? result : [result]), new ProcessedJSXNodeImpl(textType, props, children, key))) : new ProcessedJSXNodeImpl(textType, props, children, key);
      })(node, invocationContext);
    }
    if (isArray(node)) {
      const output = promiseAll(node.flatMap((n) => processData$1(n, invocationContext)));
      return then(output, (array) => array.flat(100).filter(isNotNullable));
    }
    return isPromise(node) ? node.then((node2) => processData$1(node2, invocationContext)) : node === SkipRender ? new ProcessedJSXNodeImpl(":skipRender", EMPTY_OBJ$1, EMPTY_ARRAY$1, null) : void logWarn("A unsupported value was passed to the JSX, skipping render. Value:", node);
  }
};
const SVG_NS = "http://www.w3.org/2000/svg";
const CHILDREN_PLACEHOLDER = [];
const visitJsxNode = (ctx, oldVnode, newVnode, flags) => smartUpdateChildren(ctx, oldVnode, newVnode, "root", flags);
const smartUpdateChildren = (ctx, oldVnode, newVnode, mode, flags) => {
  oldVnode.$elm$;
  const ch = newVnode.$children$;
  if (1 === ch.length && ":skipRender" === ch[0].$type$) {
    return;
  }
  const elm = oldVnode.$elm$;
  oldVnode.$children$ === CHILDREN_PLACEHOLDER && "HEAD" === elm.nodeName && (mode = "head", flags |= 2);
  const oldCh = getVnodeChildren(oldVnode, mode);
  return oldCh.length > 0 && ch.length > 0 ? updateChildren(ctx, elm, oldCh, ch, flags) : ch.length > 0 ? addVnodes(ctx, elm, null, ch, 0, ch.length - 1, flags) : oldCh.length > 0 ? removeVnodes(ctx.$static$, oldCh, 0, oldCh.length - 1) : void 0;
};
const getVnodeChildren = (vnode, mode) => {
  const oldCh = vnode.$children$;
  const elm = vnode.$elm$;
  return oldCh === CHILDREN_PLACEHOLDER ? vnode.$children$ = getChildrenVnodes(elm, mode) : oldCh;
};
const updateChildren = (ctx, parentElm, oldCh, newCh, flags) => {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx;
  let idxInOld;
  let elmToMove;
  const results = [];
  const staticCtx = ctx.$static$;
  for (; oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx; ) {
    if (null == oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (null == oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (null == newStartVnode) {
      newStartVnode = newCh[++newStartIdx];
    } else if (null == newEndVnode) {
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      results.push(patchVnode(ctx, oldStartVnode, newStartVnode, flags)), oldStartVnode = oldCh[++oldStartIdx], newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      results.push(patchVnode(ctx, oldEndVnode, newEndVnode, flags)), oldEndVnode = oldCh[--oldEndIdx], newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      oldStartVnode.$elm$, oldEndVnode.$elm$, results.push(patchVnode(ctx, oldStartVnode, newEndVnode, flags)), insertBefore(staticCtx, parentElm, oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling), oldStartVnode = oldCh[++oldStartIdx], newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      oldStartVnode.$elm$, oldEndVnode.$elm$, results.push(patchVnode(ctx, oldEndVnode, newStartVnode, flags)), insertBefore(staticCtx, parentElm, oldEndVnode.$elm$, oldStartVnode.$elm$), oldEndVnode = oldCh[--oldEndIdx], newStartVnode = newCh[++newStartIdx];
    } else {
      if (void 0 === oldKeyToIdx && (oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)), idxInOld = oldKeyToIdx[newStartVnode.$key$], void 0 === idxInOld) {
        const newElm = createElm(ctx, newStartVnode, flags);
        results.push(then(newElm, (newElm2) => {
          insertBefore(staticCtx, parentElm, newElm2, oldStartVnode.$elm$);
        }));
      } else if (elmToMove = oldCh[idxInOld], isTagName(elmToMove, newStartVnode.$type$)) {
        results.push(patchVnode(ctx, elmToMove, newStartVnode, flags)), oldCh[idxInOld] = void 0, elmToMove.$elm$, insertBefore(staticCtx, parentElm, elmToMove.$elm$, oldStartVnode.$elm$);
      } else {
        const newElm = createElm(ctx, newStartVnode, flags);
        results.push(then(newElm, (newElm2) => {
          insertBefore(staticCtx, parentElm, newElm2, oldStartVnode.$elm$);
        }));
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }
  if (newStartIdx <= newEndIdx) {
    const before = null == newCh[newEndIdx + 1] ? null : newCh[newEndIdx + 1].$elm$;
    results.push(addVnodes(ctx, parentElm, before, newCh, newStartIdx, newEndIdx, flags));
  }
  let wait = promiseAll(results);
  return oldStartIdx <= oldEndIdx && (wait = then(wait, () => {
    removeVnodes(staticCtx, oldCh, oldStartIdx, oldEndIdx);
  })), wait;
};
const getCh = (elm, filter) => {
  const end = isVirtualElement(elm) ? elm.close : null;
  const nodes = [];
  let node = elm.firstChild;
  for (; (node = processVirtualNodes(node)) && (filter(node) && nodes.push(node), node = node.nextSibling, node !== end); ) {
  }
  return nodes;
};
const getChildren = (elm, mode) => {
  switch (mode) {
    case "root":
      return getCh(elm, isChildComponent);
    case "head":
      return getCh(elm, isHeadChildren);
    case "elements":
      return getCh(elm, isQwikElement);
  }
};
const getChildrenVnodes = (elm, mode) => getChildren(elm, mode).map(getVnodeFromEl);
const getVnodeFromEl = (el) => {
  var _a2, _b;
  return isElement(el) ? (_b = (_a2 = tryGetContext(el)) == null ? void 0 : _a2.$vdom$) != null ? _b : domToVnode(el) : domToVnode(el);
};
const domToVnode = (node) => {
  if (isQwikElement(node)) {
    const props = isVirtualElement(node) ? EMPTY_OBJ$1 : getProps(node);
    const t = new ProcessedJSXNodeImpl(node.localName, props, CHILDREN_PLACEHOLDER, getKey(node));
    return t.$elm$ = node, t;
  }
  if (3 === node.nodeType) {
    const t = new ProcessedJSXNodeImpl(node.nodeName, {}, CHILDREN_PLACEHOLDER, null);
    return t.$text$ = node.data, t.$elm$ = node, t;
  }
  throw new Error("invalid node");
};
const getProps = (node) => {
  const props = {};
  const attributes = node.attributes;
  const len = attributes.length;
  for (let i = 0; i < len; i++) {
    const attr = attributes.item(i);
    const name = attr.name;
    name.includes(":") || (props[name] = "class" === name ? parseDomClass(attr.value) : attr.value);
  }
  return props;
};
const parseDomClass = (value) => parseClassList(value).filter((c) => !c.startsWith("\u2B50\uFE0F")).join(" ");
const isHeadChildren = (node) => {
  const type = node.nodeType;
  return 1 === type ? node.hasAttribute("q:head") : 111 === type;
};
const isSlotTemplate = (node) => "Q:TEMPLATE" === node.nodeName;
const isChildComponent = (node) => {
  const type = node.nodeType;
  if (3 === type || 111 === type) {
    return true;
  }
  if (1 !== type) {
    return false;
  }
  const nodeName = node.nodeName;
  return "Q:TEMPLATE" !== nodeName && ("HEAD" !== nodeName || node.hasAttribute("q:head"));
};
const patchVnode = (rctx, oldVnode, newVnode, flags) => {
  oldVnode.$type$, newVnode.$type$;
  const elm = oldVnode.$elm$;
  const tag = newVnode.$type$;
  const staticCtx = rctx.$static$;
  const isVirtual = ":virtual" === tag;
  if (newVnode.$elm$ = elm, "#text" === tag) {
    return void (oldVnode.$text$ !== newVnode.$text$ && setProperty(staticCtx, elm, "data", newVnode.$text$));
  }
  let isSvg = !!(1 & flags);
  isSvg || "svg" !== tag || (flags |= 1, isSvg = true);
  const props = newVnode.$props$;
  const isComponent = isVirtual && "q:renderFn" in props;
  const elCtx = getContext(elm);
  if (!isComponent) {
    const listenerMap = updateProperties(elCtx, staticCtx, oldVnode.$props$, props, isSvg);
    const currentComponent = rctx.$cmpCtx$;
    if (currentComponent && !currentComponent.$attachedListeners$) {
      currentComponent.$attachedListeners$ = true;
      for (const key of Object.keys(currentComponent.li)) {
        addQRLListener(listenerMap, key, currentComponent.li[key]), addGlobalListener(staticCtx, elm, key);
      }
    }
    for (const key of Object.keys(listenerMap)) {
      setAttribute(staticCtx, elm, key, serializeQRLs(listenerMap[key], elCtx));
    }
    if (isSvg && "foreignObject" === newVnode.$type$ && (flags &= -2, isSvg = false), isVirtual && "q:s" in props) {
      const currentComponent2 = rctx.$cmpCtx$;
      return currentComponent2.$slots$, void currentComponent2.$slots$.push(newVnode);
    }
    if (void 0 !== props[dangerouslySetInnerHTML]) {
      return;
    }
    if (isVirtual && "qonce" in props) {
      return;
    }
    return smartUpdateChildren(rctx, oldVnode, newVnode, "root", flags);
  }
  let needsRender = setComponentProps$1(elCtx, rctx, props);
  return needsRender || elCtx.$renderQrl$ || elCtx.$element$.hasAttribute("q:id") || (setQId(rctx, elCtx), elCtx.$renderQrl$ = props["q:renderFn"], elCtx.$renderQrl$, needsRender = true), needsRender ? then(renderComponent(rctx, elCtx, flags), () => renderContentProjection(rctx, elCtx, newVnode, flags)) : renderContentProjection(rctx, elCtx, newVnode, flags);
};
const renderContentProjection = (rctx, hostCtx, vnode, flags) => {
  const newChildren = vnode.$children$;
  const staticCtx = rctx.$static$;
  const splittedNewChidren = ((input) => {
    var _a2;
    const output = {};
    for (const item of input) {
      const key = getSlotName(item);
      ((_a2 = output[key]) != null ? _a2 : output[key] = new ProcessedJSXNodeImpl(":virtual", {
        "q:s": ""
      }, [], key)).$children$.push(item);
    }
    return output;
  })(newChildren);
  const slotRctx = pushRenderContext(rctx, hostCtx);
  const slotMaps = getSlotMap(hostCtx);
  for (const key of Object.keys(slotMaps.slots)) {
    if (!splittedNewChidren[key]) {
      const slotEl = slotMaps.slots[key];
      const oldCh = getChildrenVnodes(slotEl, "root");
      if (oldCh.length > 0) {
        const slotCtx = tryGetContext(slotEl);
        slotCtx && slotCtx.$vdom$ && (slotCtx.$vdom$.$children$ = []), removeVnodes(staticCtx, oldCh, 0, oldCh.length - 1);
      }
    }
  }
  for (const key of Object.keys(slotMaps.templates)) {
    const templateEl = slotMaps.templates[key];
    templateEl && (splittedNewChidren[key] && !slotMaps.slots[key] || (removeNode(staticCtx, templateEl), slotMaps.templates[key] = void 0));
  }
  return promiseAll(Object.keys(splittedNewChidren).map((key) => {
    const newVdom = splittedNewChidren[key];
    const slotElm = getSlotElement(staticCtx, slotMaps, hostCtx.$element$, key);
    const slotCtx = getContext(slotElm);
    const oldVdom = getVdom(slotCtx);
    return slotCtx.$vdom$ = newVdom, newVdom.$elm$ = slotElm, smartUpdateChildren(slotRctx, oldVdom, newVdom, "root", flags);
  }));
};
const addVnodes = (ctx, parentElm, before, vnodes, startIdx, endIdx, flags) => {
  const promises = [];
  let hasPromise = false;
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx];
    const elm = createElm(ctx, ch, flags);
    promises.push(elm), isPromise(elm) && (hasPromise = true);
  }
  if (hasPromise) {
    return Promise.all(promises).then((children) => insertChildren(ctx.$static$, parentElm, children, before));
  }
  insertChildren(ctx.$static$, parentElm, promises, before);
};
const insertChildren = (ctx, parentElm, children, before) => {
  for (const child of children) {
    insertBefore(ctx, parentElm, child, before);
  }
};
const removeVnodes = (ctx, nodes, startIdx, endIdx) => {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = nodes[startIdx];
    ch && (ch.$elm$, removeNode(ctx, ch.$elm$));
  }
};
const getSlotElement = (ctx, slotMaps, parentEl, slotName) => {
  const slotEl = slotMaps.slots[slotName];
  if (slotEl) {
    return slotEl;
  }
  const templateEl = slotMaps.templates[slotName];
  if (templateEl) {
    return templateEl;
  }
  const template = createTemplate(ctx.$doc$, slotName);
  return ((ctx2, parent, newChild) => {
    ctx2.$operations$.push({
      $operation$: directInsertBefore,
      $args$: [parent, newChild, parent.firstChild]
    });
  })(ctx, parentEl, template), slotMaps.templates[slotName] = template, template;
};
const getSlotName = (node) => {
  var _a2;
  return (_a2 = node.$props$[QSlot]) != null ? _a2 : "";
};
const createElm = (rctx, vnode, flags) => {
  const tag = vnode.$type$;
  const doc = rctx.$static$.$doc$;
  if ("#text" === tag) {
    return vnode.$elm$ = ((doc2, text) => doc2.createTextNode(text))(doc, vnode.$text$);
  }
  let elm;
  let isHead = !!(2 & flags);
  let isSvg = !!(1 & flags);
  isSvg || "svg" !== tag || (flags |= 1, isSvg = true);
  const isVirtual = ":virtual" === tag;
  const props = vnode.$props$;
  const isComponent = "q:renderFn" in props;
  const staticCtx = rctx.$static$;
  isVirtual ? elm = ((doc2) => {
    const open = doc2.createComment("qv ");
    const close = doc2.createComment("/qv");
    return new VirtualElementImpl(open, close);
  })(doc) : "head" === tag ? (elm = doc.head, flags |= 2, isHead = true) : (elm = createElement(doc, tag, isSvg), flags &= -3), vnode.$elm$ = elm, isSvg && "foreignObject" === tag && (isSvg = false, flags &= -2);
  const elCtx = getContext(elm);
  if (isComponent) {
    setKey(elm, vnode.$key$);
    const renderQRL = props["q:renderFn"];
    return setComponentProps$1(elCtx, rctx, props), setQId(rctx, elCtx), elCtx.$renderQrl$ = renderQRL, then(renderComponent(rctx, elCtx, flags), () => {
      let children2 = vnode.$children$;
      if (0 === children2.length) {
        return elm;
      }
      1 === children2.length && ":skipRender" === children2[0].$type$ && (children2 = children2[0].$children$);
      const slotRctx = pushRenderContext(rctx, elCtx);
      const slotMap = getSlotMap(elCtx);
      const elements = children2.map((ch) => createElm(slotRctx, ch, flags));
      return then(promiseAll(elements), () => {
        for (const node of children2) {
          node.$elm$, appendChild(staticCtx, getSlotElement(staticCtx, slotMap, elm, getSlotName(node)), node.$elm$);
        }
        return elm;
      });
    });
  }
  const currentComponent = rctx.$cmpCtx$;
  const isSlot = isVirtual && "q:s" in props;
  const hasRef = !isVirtual && "ref" in props;
  const listenerMap = setProperties(staticCtx, elCtx, props, isSvg);
  if (currentComponent && !isVirtual) {
    const scopedIds = currentComponent.$scopeIds$;
    if (scopedIds && scopedIds.forEach((styleId) => {
      elm.classList.add(styleId);
    }), !currentComponent.$attachedListeners$) {
      currentComponent.$attachedListeners$ = true;
      for (const eventName of Object.keys(currentComponent.li)) {
        addQRLListener(listenerMap, eventName, currentComponent.li[eventName]);
      }
    }
  }
  isSlot ? (currentComponent.$slots$, setKey(elm, vnode.$key$), directSetAttribute(elm, "q:sref", currentComponent.$id$), currentComponent.$slots$.push(vnode), staticCtx.$addSlots$.push([elm, currentComponent.$element$])) : setKey(elm, vnode.$key$);
  {
    const listeners = Object.keys(listenerMap);
    isHead && !isVirtual && directSetAttribute(elm, "q:head", ""), (listeners.length > 0 || hasRef) && setQId(rctx, elCtx);
    for (const key of listeners) {
      setAttribute(staticCtx, elm, key, serializeQRLs(listenerMap[key], elCtx));
    }
  }
  if (void 0 !== props[dangerouslySetInnerHTML]) {
    return elm;
  }
  let children = vnode.$children$;
  if (0 === children.length) {
    return elm;
  }
  1 === children.length && ":skipRender" === children[0].$type$ && (children = children[0].$children$);
  const promises = children.map((ch) => createElm(rctx, ch, flags));
  return then(promiseAll(promises), () => {
    for (const node of children) {
      node.$elm$, appendChild(rctx.$static$, elm, node.$elm$);
    }
    return elm;
  });
};
const getSlotMap = (ctx) => {
  var _a2, _b;
  const slotsArray = ((ctx2) => ctx2.$slots$ || (ctx2.$element$.parentElement, ctx2.$slots$ = readDOMSlots(ctx2)))(ctx);
  const slots = {};
  const templates = {};
  const t = Array.from(ctx.$element$.childNodes).filter(isSlotTemplate);
  for (const vnode of slotsArray) {
    vnode.$elm$, slots[(_a2 = vnode.$key$) != null ? _a2 : ""] = vnode.$elm$;
  }
  for (const elm of t) {
    templates[(_b = directGetAttribute(elm, QSlot)) != null ? _b : ""] = elm;
  }
  return {
    slots,
    templates
  };
};
const readDOMSlots = (ctx) => ((el, prop, value) => {
  const walker = ((el2, prop2, value2) => el2.ownerDocument.createTreeWalker(el2, 128, {
    acceptNode(c) {
      const virtual = getVirtualElement(c);
      return virtual && directGetAttribute(virtual, "q:sref") === value2 ? 1 : 2;
    }
  }))(el, 0, value);
  const pars = [];
  let currentNode = null;
  for (; currentNode = walker.nextNode(); ) {
    pars.push(getVirtualElement(currentNode));
  }
  return pars;
})(ctx.$element$.parentElement, 0, ctx.$id$).map(domToVnode);
const checkBeforeAssign = (ctx, elm, prop, newValue) => (prop in elm && elm[prop] !== newValue && setProperty(ctx, elm, prop, newValue), true);
const dangerouslySetInnerHTML = "dangerouslySetInnerHTML";
const PROP_HANDLER_MAP = {
  style: (ctx, elm, _, newValue) => (setProperty(ctx, elm.style, "cssText", stringifyStyle(newValue)), true),
  class: (ctx, elm, _, newValue, oldValue) => {
    const oldClasses = parseClassList(oldValue);
    const newClasses = parseClassList(newValue);
    return ((ctx2, elm2, toRemove, toAdd) => {
      ctx2 ? ctx2.$operations$.push({
        $operation$: _setClasslist,
        $args$: [elm2, toRemove, toAdd]
      }) : _setClasslist(elm2, toRemove, toAdd);
    })(ctx, elm, oldClasses.filter((c) => c && !newClasses.includes(c)), newClasses.filter((c) => c && !oldClasses.includes(c))), true;
  },
  value: checkBeforeAssign,
  checked: checkBeforeAssign,
  [dangerouslySetInnerHTML]: (ctx, elm, _, newValue) => (dangerouslySetInnerHTML in elm ? setProperty(ctx, elm, dangerouslySetInnerHTML, newValue) : "innerHTML" in elm && setProperty(ctx, elm, "innerHTML", newValue), true),
  innerHTML: () => true
};
const updateProperties = (elCtx, staticCtx, oldProps, newProps, isSvg) => {
  const keys = getKeys(oldProps, newProps);
  const listenersMap = elCtx.li = {};
  if (0 === keys.length) {
    return listenersMap;
  }
  const elm = elCtx.$element$;
  for (let key of keys) {
    if ("children" === key) {
      continue;
    }
    let newValue = newProps[key];
    "className" === key && (newProps.class = newValue, key = "class"), "class" === key && (newProps.class = newValue = serializeClass(newValue));
    const oldValue = oldProps[key];
    if (oldValue === newValue) {
      continue;
    }
    if ("ref" === key) {
      newValue.current = elm;
      continue;
    }
    if (isOnProp(key)) {
      setEvent(listenersMap, key, newValue);
      continue;
    }
    const exception = PROP_HANDLER_MAP[key];
    exception && exception(staticCtx, elm, key, newValue, oldValue) || (isSvg || !(key in elm) ? setAttribute(staticCtx, elm, key, newValue) : setProperty(staticCtx, elm, key, newValue));
  }
  return listenersMap;
};
const getKeys = (oldProps, newProps) => {
  const keys = Object.keys(newProps);
  return keys.push(...Object.keys(oldProps).filter((p) => !keys.includes(p))), keys;
};
const addGlobalListener = (staticCtx, elm, prop) => {
  try {
    window.qwikevents && window.qwikevents.push(getEventName(prop));
  } catch (err) {
  }
};
const setProperties = (rctx, elCtx, newProps, isSvg) => {
  const elm = elCtx.$element$;
  const keys = Object.keys(newProps);
  const listenerMap = elCtx.li;
  if (0 === keys.length) {
    return listenerMap;
  }
  for (let key of keys) {
    if ("children" === key) {
      continue;
    }
    let newValue = newProps[key];
    if ("className" === key && (newProps.class = newValue, key = "class"), "class" === key && (newProps.class = newValue = serializeClass(newValue)), "ref" === key) {
      newValue.current = elm;
      continue;
    }
    if (isOnProp(key)) {
      addGlobalListener(rctx, elm, setEvent(listenerMap, key, newValue));
      continue;
    }
    const exception = PROP_HANDLER_MAP[key];
    exception && exception(rctx, elm, key, newValue, void 0) || (isSvg || !(key in elm) ? setAttribute(rctx, elm, key, newValue) : setProperty(rctx, elm, key, newValue));
  }
  return listenerMap;
};
const setComponentProps$1 = (ctx, rctx, expectProps) => {
  const keys = Object.keys(expectProps);
  if (0 === keys.length) {
    return false;
  }
  const qwikProps = getPropsMutator(ctx, rctx.$static$.$containerState$);
  for (const key of keys) {
    SKIPS_PROPS.includes(key) || qwikProps.set(key, expectProps[key]);
  }
  return ctx.$dirty$;
};
const cleanupTree = (parent, rctx, subsManager, stopSlots) => {
  if (stopSlots && parent.hasAttribute("q:s")) {
    return void rctx.$rmSlots$.push(parent);
  }
  cleanupElement(parent, subsManager);
  const ch = getChildren(parent, "elements");
  for (const child of ch) {
    cleanupTree(child, rctx, subsManager, stopSlots);
  }
};
const cleanupElement = (el, subsManager) => {
  const ctx = tryGetContext(el);
  ctx && cleanupContext(ctx, subsManager);
};
const directAppendChild = (parent, child) => {
  isVirtualElement(child) ? child.appendTo(parent) : parent.appendChild(child);
};
const directRemoveChild = (parent, child) => {
  isVirtualElement(child) ? child.remove() : parent.removeChild(child);
};
const directInsertBefore = (parent, child, ref) => {
  isVirtualElement(child) ? child.insertBeforeTo(parent, getRootNode(ref)) : parent.insertBefore(child, getRootNode(ref));
};
const createKeyToOldIdx = (children, beginIdx, endIdx) => {
  const map = {};
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i].$key$;
    null != key && (map[key] = i);
  }
  return map;
};
const sameVnode = (vnode1, vnode2) => vnode1.$type$ === vnode2.$type$ && vnode1.$key$ === vnode2.$key$;
const isTagName = (elm, tagName) => elm.$type$ === tagName;
const useLexicalScope = () => {
  const context = getInvokeContext();
  let qrl = context.$qrl$;
  if (qrl) {
    qrl.$captureRef$;
  } else {
    const el = context.$element$;
    const container = getWrappingContainer(el);
    const ctx = getContext(el);
    qrl = parseQRL(decodeURIComponent(String(context.$url$)), container), resumeIfNeeded(container), inflateQrl(qrl, ctx);
  }
  return qrl.$captureRef$;
};
const notifyWatch = (watch, containerState) => {
  watch.$flags$ & WatchFlagsIsDirty || (watch.$flags$ |= WatchFlagsIsDirty, void 0 !== containerState.$hostsRendering$ ? (containerState.$renderPromise$, containerState.$watchStaging$.add(watch)) : (containerState.$watchNext$.add(watch), scheduleFrame(containerState)));
};
const scheduleFrame = (containerState) => (void 0 === containerState.$renderPromise$ && (containerState.$renderPromise$ = getPlatform().nextTick(() => renderMarked(containerState))), containerState.$renderPromise$);
const _hW = () => {
  const [watch] = useLexicalScope();
  notifyWatch(watch, getContainerState(getWrappingContainer(watch.$el$)));
};
const renderMarked = async (containerState) => {
  const hostsRendering = containerState.$hostsRendering$ = new Set(containerState.$hostsNext$);
  containerState.$hostsNext$.clear(), await executeWatchesBefore(containerState), containerState.$hostsStaging$.forEach((host) => {
    hostsRendering.add(host);
  }), containerState.$hostsStaging$.clear();
  const doc = getDocument(containerState.$containerEl$);
  const renderingQueue = Array.from(hostsRendering);
  sortNodes(renderingQueue);
  const ctx = createRenderContext(doc, containerState);
  const staticCtx = ctx.$static$;
  for (const el of renderingQueue) {
    if (!staticCtx.$hostElements$.has(el)) {
      const elCtx = getContext(el);
      if (elCtx.$renderQrl$) {
        el.isConnected, staticCtx.$roots$.push(elCtx);
        try {
          await renderComponent(ctx, elCtx, getFlags(el.parentElement));
        } catch (err) {
          logError(err);
        }
      }
    }
  }
  return staticCtx.$operations$.push(...staticCtx.$postOperations$), 0 === staticCtx.$operations$.length ? void postRendering(containerState, staticCtx) : getPlatform().raf(() => {
    (({ $static$: ctx2 }) => {
      executeDOMRender(ctx2);
    })(ctx), postRendering(containerState, staticCtx);
  });
};
const getFlags = (el) => {
  let flags = 0;
  return el && (el.namespaceURI === SVG_NS && (flags |= 1), "HEAD" === el.tagName && (flags |= 2)), flags;
};
const postRendering = async (containerState, ctx) => {
  await executeWatchesAfter(containerState, (watch, stage) => 0 != (watch.$flags$ & WatchFlagsIsEffect) && (!stage || ctx.$hostElements$.has(watch.$el$))), containerState.$hostsStaging$.forEach((el) => {
    containerState.$hostsNext$.add(el);
  }), containerState.$hostsStaging$.clear(), containerState.$hostsRendering$ = void 0, containerState.$renderPromise$ = void 0, containerState.$hostsNext$.size + containerState.$watchNext$.size > 0 && scheduleFrame(containerState);
};
const executeWatchesBefore = async (containerState) => {
  const resourcesPromises = [];
  const containerEl = containerState.$containerEl$;
  const watchPromises = [];
  const isWatch = (watch) => 0 != (watch.$flags$ & WatchFlagsIsWatch);
  const isResourceWatch2 = (watch) => 0 != (watch.$flags$ & WatchFlagsIsResource);
  containerState.$watchNext$.forEach((watch) => {
    isWatch(watch) && (watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)), containerState.$watchNext$.delete(watch)), isResourceWatch2(watch) && (resourcesPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)), containerState.$watchNext$.delete(watch));
  });
  do {
    if (containerState.$watchStaging$.forEach((watch) => {
      isWatch(watch) ? watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)) : isResourceWatch2(watch) ? resourcesPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)) : containerState.$watchNext$.add(watch);
    }), containerState.$watchStaging$.clear(), watchPromises.length > 0) {
      const watches = await Promise.all(watchPromises);
      sortWatches(watches), await Promise.all(watches.map((watch) => runSubscriber(watch, containerState))), watchPromises.length = 0;
    }
  } while (containerState.$watchStaging$.size > 0);
  if (resourcesPromises.length > 0) {
    const resources = await Promise.all(resourcesPromises);
    sortWatches(resources), resources.forEach((watch) => runSubscriber(watch, containerState));
  }
};
const executeWatchesAfter = async (containerState, watchPred) => {
  const watchPromises = [];
  const containerEl = containerState.$containerEl$;
  containerState.$watchNext$.forEach((watch) => {
    watchPred(watch, false) && (watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)), containerState.$watchNext$.delete(watch));
  });
  do {
    if (containerState.$watchStaging$.forEach((watch) => {
      watchPred(watch, true) ? watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)) : containerState.$watchNext$.add(watch);
    }), containerState.$watchStaging$.clear(), watchPromises.length > 0) {
      const watches = await Promise.all(watchPromises);
      sortWatches(watches), await Promise.all(watches.map((watch) => runSubscriber(watch, containerState))), watchPromises.length = 0;
    }
  } while (containerState.$watchStaging$.size > 0);
};
const sortNodes = (elements) => {
  elements.sort((a, b) => 2 & a.compareDocumentPosition(getRootNode(b)) ? 1 : -1);
};
const sortWatches = (watches) => {
  watches.sort((a, b) => a.$el$ === b.$el$ ? a.$index$ < b.$index$ ? -1 : 1 : 0 != (2 & a.$el$.compareDocumentPosition(getRootNode(b.$el$))) ? 1 : -1);
};
const CONTAINER_STATE = Symbol("ContainerState");
const getContainerState = (containerEl) => {
  let set = containerEl[CONTAINER_STATE];
  return set || (containerEl[CONTAINER_STATE] = set = createContainerState(containerEl)), set;
};
const createContainerState = (containerEl) => {
  const containerState = {
    $containerEl$: containerEl,
    $proxyMap$: /* @__PURE__ */ new WeakMap(),
    $subsManager$: null,
    $watchNext$: /* @__PURE__ */ new Set(),
    $watchStaging$: /* @__PURE__ */ new Set(),
    $hostsNext$: /* @__PURE__ */ new Set(),
    $hostsStaging$: /* @__PURE__ */ new Set(),
    $renderPromise$: void 0,
    $hostsRendering$: void 0,
    $envData$: {},
    $elementIndex$: 0,
    $styleIds$: /* @__PURE__ */ new Set(),
    $mutableProps$: false
  };
  return containerState.$subsManager$ = createSubscriptionManager(containerState), containerState;
};
const createSubscriptionManager = (containerState) => {
  const objToSubs = /* @__PURE__ */ new Map();
  const subsToObjs = /* @__PURE__ */ new Map();
  const tryGetLocal = (obj) => (getProxyTarget(obj), objToSubs.get(obj));
  const trackSubToObj = (subscriber, map) => {
    let set = subsToObjs.get(subscriber);
    set || subsToObjs.set(subscriber, set = /* @__PURE__ */ new Set()), set.add(map);
  };
  const manager = {
    $tryGetLocal$: tryGetLocal,
    $getLocal$: (obj, initialMap) => {
      let local = tryGetLocal(obj);
      if (local)
        ;
      else {
        const map = initialMap || /* @__PURE__ */ new Map();
        map.forEach((_, key) => {
          trackSubToObj(key, map);
        }), objToSubs.set(obj, local = {
          $subs$: map,
          $addSub$(subscriber, key) {
            if (null == key) {
              map.set(subscriber, null);
            } else {
              let sub = map.get(subscriber);
              void 0 === sub && map.set(subscriber, sub = /* @__PURE__ */ new Set()), sub && sub.add(key);
            }
            trackSubToObj(subscriber, map);
          },
          $notifySubs$(key) {
            map.forEach((value, subscriber) => {
              null !== value && key && !value.has(key) || ((subscriber2, containerState2) => {
                isQwikElement(subscriber2) ? ((hostElement, containerState3) => {
                  const server = isServer$1();
                  server || resumeIfNeeded(containerState3.$containerEl$);
                  const ctx = getContext(hostElement);
                  if (ctx.$renderQrl$, !ctx.$dirty$) {
                    if (ctx.$dirty$ = true, void 0 !== containerState3.$hostsRendering$) {
                      containerState3.$renderPromise$, containerState3.$hostsStaging$.add(hostElement);
                    } else {
                      if (server) {
                        return void logWarn();
                      }
                      containerState3.$hostsNext$.add(hostElement), scheduleFrame(containerState3);
                    }
                  }
                })(subscriber2, containerState2) : notifyWatch(subscriber2, containerState2);
              })(subscriber, containerState);
            });
          }
        });
      }
      return local;
    },
    $clearSub$: (sub) => {
      const subs = subsToObjs.get(sub);
      subs && (subs.forEach((s) => {
        s.delete(sub);
      }), subsToObjs.delete(sub), subs.clear());
    }
  };
  return manager;
};
const _pauseFromContexts = async (allContexts, containerState) => {
  const collector = createCollector(containerState);
  const listeners = [];
  for (const ctx of allContexts) {
    const el = ctx.$element$;
    const ctxLi = ctx.li;
    for (const key of Object.keys(ctxLi)) {
      for (const qrl of ctxLi[key]) {
        const captured = qrl.$captureRef$;
        if (captured) {
          for (const obj of captured) {
            collectValue(obj, collector, true);
          }
        }
        isElement(el) && listeners.push({
          key,
          qrl,
          el,
          eventName: getEventName(key)
        });
      }
    }
    ctx.$watches$ && collector.$watches$.push(...ctx.$watches$);
  }
  if (0 === listeners.length) {
    return {
      state: {
        ctx: {},
        objs: [],
        subs: []
      },
      objs: [],
      listeners: [],
      mode: "static"
    };
  }
  let promises;
  for (; (promises = collector.$promises$).length > 0; ) {
    collector.$promises$ = [], await Promise.allSettled(promises);
  }
  const canRender = collector.$elements$.length > 0;
  if (canRender) {
    for (const element of collector.$elements$) {
      collectElementData(tryGetContext(element), collector);
    }
    for (const ctx of allContexts) {
      if (ctx.$props$ && collectMutableProps(ctx.$element$, ctx.$props$, collector), ctx.$contexts$) {
        for (const item of ctx.$contexts$.values()) {
          collectValue(item, collector, false);
        }
      }
    }
  }
  for (; (promises = collector.$promises$).length > 0; ) {
    collector.$promises$ = [], await Promise.allSettled(promises);
  }
  const elementToIndex = /* @__PURE__ */ new Map();
  const objs = Array.from(collector.$objSet$.keys());
  const objToId = /* @__PURE__ */ new Map();
  const getElementID = (el) => {
    let id = elementToIndex.get(el);
    return void 0 === id && (id = ((el2) => {
      const ctx = tryGetContext(el2);
      return ctx ? ctx.$id$ : null;
    })(el), id ? id = "#" + id : console.warn("Missing ID", el), elementToIndex.set(el, id)), id;
  };
  const getObjId = (obj) => {
    let suffix = "";
    if (isMutable(obj) && (obj = obj.mut, suffix = "%"), isPromise(obj)) {
      const { value, resolved } = getPromiseValue(obj);
      obj = value, suffix += resolved ? "~" : "_";
    }
    if (isObject(obj)) {
      const target = getProxyTarget(obj);
      if (target) {
        suffix += "!", obj = target;
      } else if (isQwikElement(obj)) {
        const elID = getElementID(obj);
        return elID ? elID + suffix : null;
      }
    }
    const id = objToId.get(obj);
    return id ? id + suffix : null;
  };
  const mustGetObjId = (obj) => {
    const key = getObjId(obj);
    if (null === key) {
      throw qError(QError_missingObjectId, obj);
    }
    return key;
  };
  const subsMap = /* @__PURE__ */ new Map();
  objs.forEach((obj) => {
    const proxy = containerState.$proxyMap$.get(obj);
    const flags = getProxyFlags(proxy);
    if (void 0 === flags) {
      return;
    }
    const subsObj = [];
    flags > 0 && subsObj.push({
      subscriber: "$",
      data: flags
    }), getProxySubs(proxy).forEach((set, key) => {
      isNode(key) && isVirtualElement(key) && !collector.$elements$.includes(key) || subsObj.push({
        subscriber: key,
        data: set ? Array.from(set) : null
      });
    }), subsObj.length > 0 && subsMap.set(obj, subsObj);
  }), objs.sort((a, b) => (subsMap.has(a) ? 0 : 1) - (subsMap.has(b) ? 0 : 1));
  let count = 0;
  for (const obj of objs) {
    objToId.set(obj, intToStr(count)), count++;
  }
  if (collector.$noSerialize$.length > 0) {
    const undefinedID = objToId.get(void 0);
    for (const obj of collector.$noSerialize$) {
      objToId.set(obj, undefinedID);
    }
  }
  const subs = objs.map((obj) => {
    const sub = subsMap.get(obj);
    if (!sub) {
      return;
    }
    const subsObj = {};
    return sub.forEach(({ subscriber, data }) => {
      if ("$" === subscriber) {
        subsObj[subscriber] = data;
      } else {
        const id = getObjId(subscriber);
        null !== id && (subsObj[id] = data);
      }
    }), subsObj;
  }).filter(isNotNullable);
  const convertedObjs = objs.map((obj) => {
    if (null === obj) {
      return null;
    }
    const typeObj = typeof obj;
    switch (typeObj) {
      case "undefined":
        return UNDEFINED_PREFIX;
      case "string":
      case "number":
      case "boolean":
        return obj;
      default:
        const value = serializeValue(obj, getObjId, containerState);
        if (void 0 !== value) {
          return value;
        }
        if ("object" === typeObj) {
          if (isArray(obj)) {
            return obj.map(mustGetObjId);
          }
          if (isSerializableObject(obj)) {
            const output = {};
            for (const key of Object.keys(obj)) {
              output[key] = mustGetObjId(obj[key]);
            }
            return output;
          }
        }
    }
    throw qError(QError_verifySerializable, obj);
  });
  const meta = {};
  allContexts.forEach((ctx) => {
    const node = ctx.$element$;
    const ref = ctx.$refMap$;
    const props = ctx.$props$;
    const contexts = ctx.$contexts$;
    const watches = ctx.$watches$;
    const renderQrl = ctx.$renderQrl$;
    const seq = ctx.$seq$;
    const metaValue = {};
    const elementCaptured = isVirtualElement(node) && collector.$elements$.includes(node);
    let add = false;
    if (ref.length > 0) {
      const value = ref.map(mustGetObjId).join(" ");
      value && (metaValue.r = value, add = true);
    }
    if (canRender) {
      if (elementCaptured && props && (metaValue.h = mustGetObjId(props) + " " + mustGetObjId(renderQrl), add = true), watches && watches.length > 0) {
        const value = watches.map(getObjId).filter(isNotNullable).join(" ");
        value && (metaValue.w = value, add = true);
      }
      if (elementCaptured && seq && seq.length > 0) {
        const value = seq.map(mustGetObjId).join(" ");
        metaValue.s = value, add = true;
      }
      if (contexts) {
        const serializedContexts = [];
        contexts.forEach((value2, key) => {
          serializedContexts.push(`${key}=${mustGetObjId(value2)}`);
        });
        const value = serializedContexts.join(" ");
        value && (metaValue.c = value, add = true);
      }
    }
    if (add) {
      const elementID = getElementID(node);
      meta[elementID] = metaValue;
    }
  });
  for (const watch of collector.$watches$) {
    destroyWatch(watch);
  }
  return {
    state: {
      ctx: meta,
      objs: convertedObjs,
      subs
    },
    objs,
    listeners,
    mode: canRender ? "render" : "listeners"
  };
};
const getNodesInScope = (parent, predicate) => {
  predicate(parent);
  const walker = parent.ownerDocument.createTreeWalker(parent, 129, {
    acceptNode: (node) => isContainer(node) ? 2 : predicate(node) ? 1 : 3
  });
  const pars = [];
  let currentNode = null;
  for (; currentNode = walker.nextNode(); ) {
    pars.push(processVirtualNodes(currentNode));
  }
  return pars;
};
const reviveNestedObjects = (obj, getObject, parser) => {
  if (!parser.fill(obj) && obj && "object" == typeof obj) {
    if (isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const value = obj[i];
        "string" == typeof value ? obj[i] = getObject(value) : reviveNestedObjects(value, getObject, parser);
      }
    } else if (isSerializableObject(obj)) {
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        "string" == typeof value ? obj[key] = getObject(value) : reviveNestedObjects(value, getObject, parser);
      }
    }
  }
};
const OBJECT_TRANSFORMS = {
  "!": (obj, containerState) => {
    var _a2;
    return (_a2 = containerState.$proxyMap$.get(obj)) != null ? _a2 : getOrCreateProxy(obj, containerState);
  },
  "%": (obj) => mutable(obj),
  "~": (obj) => Promise.resolve(obj),
  _: (obj) => Promise.reject(obj)
};
const collectMutableProps = (el, props, collector) => {
  const subs = getProxySubs(props);
  subs && subs.has(el) && collectElement(el, collector);
};
const createCollector = (containerState) => ({
  $containerState$: containerState,
  $seen$: /* @__PURE__ */ new Set(),
  $objSet$: /* @__PURE__ */ new Set(),
  $noSerialize$: [],
  $elements$: [],
  $watches$: [],
  $promises$: []
});
const collectDeferElement = (el, collector) => {
  collector.$elements$.includes(el) || collector.$elements$.push(el);
};
const collectElement = (el, collector) => {
  if (collector.$elements$.includes(el)) {
    return;
  }
  const ctx = tryGetContext(el);
  ctx && (collector.$elements$.push(el), collectElementData(ctx, collector));
};
const collectElementData = (ctx, collector) => {
  if (ctx.$props$ && collectValue(ctx.$props$, collector, false), ctx.$renderQrl$ && collectValue(ctx.$renderQrl$, collector, false), ctx.$seq$) {
    for (const obj of ctx.$seq$) {
      collectValue(obj, collector, false);
    }
  }
  if (ctx.$watches$) {
    for (const obj of ctx.$watches$) {
      collectValue(obj, collector, false);
    }
  }
  if (ctx.$contexts$) {
    for (const obj of ctx.$contexts$.values()) {
      collectValue(obj, collector, false);
    }
  }
};
const PROMISE_VALUE = Symbol();
const getPromiseValue = (promise) => promise[PROMISE_VALUE];
const collectValue = (obj, collector, leaks) => {
  if (null !== obj) {
    const objType = typeof obj;
    const seen = collector.$seen$;
    switch (objType) {
      case "function":
        if (seen.has(obj)) {
          return;
        }
        if (seen.add(obj), !fastShouldSerialize(obj)) {
          return collector.$objSet$.add(void 0), void collector.$noSerialize$.push(obj);
        }
        if (isQrl$1(obj)) {
          if (collector.$objSet$.add(obj), obj.$captureRef$) {
            for (const item of obj.$captureRef$) {
              collectValue(item, collector, leaks);
            }
          }
          return;
        }
        break;
      case "object": {
        if (seen.has(obj)) {
          return;
        }
        if (seen.add(obj), !fastShouldSerialize(obj)) {
          return collector.$objSet$.add(void 0), void collector.$noSerialize$.push(obj);
        }
        if (isPromise(obj)) {
          return void collector.$promises$.push((promise = obj, promise.then((value) => {
            const v = {
              resolved: true,
              value
            };
            return promise[PROMISE_VALUE] = v, value;
          }, (value) => {
            const v = {
              resolved: false,
              value
            };
            return promise[PROMISE_VALUE] = v, value;
          })).then((value) => {
            collectValue(value, collector, leaks);
          }));
        }
        const target = getProxyTarget(obj);
        const input = obj;
        if (target) {
          if (leaks && ((proxy, collector2) => {
            const subs = getProxySubs(proxy);
            if (!collector2.$seen$.has(subs)) {
              collector2.$seen$.add(subs);
              for (const key of Array.from(subs.keys())) {
                isNode(key) && isVirtualElement(key) ? collectDeferElement(key, collector2) : collectValue(key, collector2, true);
              }
            }
          })(input, collector), obj = target, seen.has(obj)) {
            return;
          }
          if (seen.add(obj), isResourceReturn(obj)) {
            return collector.$objSet$.add(target), collectValue(obj.promise, collector, leaks), void collectValue(obj.resolved, collector, leaks);
          }
        } else if (isNode(obj)) {
          return;
        }
        if (isArray(obj)) {
          for (let i = 0; i < obj.length; i++) {
            collectValue(input[i], collector, leaks);
          }
        } else {
          for (const key of Object.keys(obj)) {
            collectValue(input[key], collector, leaks);
          }
        }
        break;
      }
    }
  }
  var promise;
  collector.$objSet$.add(obj);
};
const isContainer = (el) => isElement(el) && el.hasAttribute("q:container");
const hasQId = (el) => {
  const node = processVirtualNodes(el);
  return !!isQwikElement(node) && node.hasAttribute("q:id");
};
const intToStr = (nu) => nu.toString(36);
const strToInt = (nu) => parseInt(nu, 36);
const getEventName = (attribute) => {
  const colonPos = attribute.indexOf(":");
  return attribute.slice(colonPos + 1).replace(/-./g, (x) => x[1].toUpperCase());
};
const WatchFlagsIsEffect = 1;
const WatchFlagsIsWatch = 2;
const WatchFlagsIsDirty = 4;
const WatchFlagsIsCleanup = 8;
const WatchFlagsIsResource = 16;
const useWatchQrl = (qrl, opts) => {
  const { get, set, ctx, i } = useSequentialScope();
  if (get) {
    return;
  }
  const el = ctx.$hostElement$;
  const containerState = ctx.$renderCtx$.$static$.$containerState$;
  const watch = new Watch(WatchFlagsIsDirty | WatchFlagsIsWatch, i, el, qrl, void 0);
  const elCtx = getContext(el);
  set(true), qrl.$resolveLazy$(containerState.$containerEl$), elCtx.$watches$ || (elCtx.$watches$ = []), elCtx.$watches$.push(watch), waitAndRun(ctx, () => runSubscriber(watch, containerState, ctx.$renderCtx$)), isServer$1() && useRunWatch(watch, opts == null ? void 0 : opts.eagerness);
};
const isResourceWatch = (watch) => !!watch.$resource$;
const runSubscriber = (watch, containerState, rctx) => (watch.$flags$, isResourceWatch(watch) ? runResource(watch, containerState) : runWatch(watch, containerState, rctx));
const runResource = (watch, containerState, waitOn) => {
  watch.$flags$ &= ~WatchFlagsIsDirty, cleanupWatch(watch);
  const el = watch.$el$;
  const invokationContext = newInvokeContext(el, void 0, "WatchEvent");
  const { $subsManager$: subsManager } = containerState;
  const watchFn = watch.$qrl$.getFn(invokationContext, () => {
    subsManager.$clearSub$(watch);
  });
  const cleanups = [];
  const resource = watch.$resource$;
  const resourceTarget = unwrapProxy(resource);
  const opts = {
    track: (obj, prop) => {
      const target = getProxyTarget(obj);
      return target ? subsManager.$getLocal$(target).$addSub$(watch, prop) : logErrorAndStop(codeToText(QError_trackUseStore), obj), prop ? obj[prop] : obj;
    },
    cleanup(callback) {
      cleanups.push(callback);
    },
    previous: resourceTarget.resolved
  };
  let resolve;
  let reject;
  let done = false;
  const setState = (resolved, value) => !done && (done = true, resolved ? (done = true, resource.state = "resolved", resource.resolved = value, resource.error = void 0, resolve(value)) : (done = true, resource.state = "rejected", resource.resolved = void 0, resource.error = value, reject(value)), true);
  invoke(invokationContext, () => {
    resource.state = "pending", resource.resolved = void 0, resource.promise = new Promise((r, re) => {
      resolve = r, reject = re;
    });
  }), watch.$destroy$ = noSerialize(() => {
    cleanups.forEach((fn) => fn());
  });
  const promise = safeCall(() => then(waitOn, () => watchFn(opts)), (value) => {
    setState(true, value);
  }, (reason) => {
    setState(false, reason);
  });
  const timeout = resourceTarget.timeout;
  return timeout ? Promise.race([promise, delay(timeout).then(() => {
    setState(false, "timeout") && cleanupWatch(watch);
  })]) : promise;
};
const runWatch = (watch, containerState, rctx) => {
  watch.$flags$ &= ~WatchFlagsIsDirty, cleanupWatch(watch);
  const hostElement = watch.$el$;
  const invokationContext = newInvokeContext(hostElement, void 0, "WatchEvent");
  const { $subsManager$: subsManager } = containerState;
  const watchFn = watch.$qrl$.getFn(invokationContext, () => {
    subsManager.$clearSub$(watch);
  });
  const cleanups = [];
  watch.$destroy$ = noSerialize(() => {
    cleanups.forEach((fn) => fn());
  });
  const opts = {
    track: (obj, prop) => {
      const target = getProxyTarget(obj);
      return target ? subsManager.$getLocal$(target).$addSub$(watch, prop) : logErrorAndStop(codeToText(QError_trackUseStore), obj), prop ? obj[prop] : obj;
    },
    cleanup(callback) {
      cleanups.push(callback);
    }
  };
  return safeCall(() => watchFn(opts), (returnValue) => {
    isFunction(returnValue) && cleanups.push(returnValue);
  }, (reason) => {
    handleError(reason, hostElement, rctx);
  });
};
const cleanupWatch = (watch) => {
  const destroy = watch.$destroy$;
  if (destroy) {
    watch.$destroy$ = void 0;
    try {
      destroy();
    } catch (err) {
      logError(err);
    }
  }
};
const destroyWatch = (watch) => {
  watch.$flags$ & WatchFlagsIsCleanup ? (watch.$flags$ &= ~WatchFlagsIsCleanup, (0, watch.$qrl$)()) : cleanupWatch(watch);
};
const useRunWatch = (watch, eagerness) => {
  "load" === eagerness ? useOn("qinit", getWatchHandlerQrl(watch)) : "visible" === eagerness && useOn("qvisible", getWatchHandlerQrl(watch));
};
const getWatchHandlerQrl = (watch) => {
  const watchQrl = watch.$qrl$;
  return createQRL(watchQrl.$chunk$, "_hW", _hW, null, null, [watch], watchQrl.$symbol$);
};
class Watch {
  constructor($flags$, $index$, $el$, $qrl$, $resource$) {
    this.$flags$ = $flags$, this.$index$ = $index$, this.$el$ = $el$, this.$qrl$ = $qrl$, this.$resource$ = $resource$;
  }
}
const _createResourceReturn = (opts) => ({
  __brand: "resource",
  promise: void 0,
  resolved: void 0,
  error: void 0,
  state: "pending",
  timeout: opts == null ? void 0 : opts.timeout
});
const isResourceReturn = (obj) => isObject(obj) && "resource" === obj.__brand;
const UNDEFINED_PREFIX = "";
const QRLSerializer = {
  prefix: "",
  test: (v) => isQrl$1(v),
  serialize: (obj, getObjId, containerState) => stringifyQRL(obj, {
    $getObjId$: getObjId
  }),
  prepare: (data, containerState) => parseQRL(data, containerState.$containerEl$),
  fill: (qrl, getObject) => {
    qrl.$capture$ && qrl.$capture$.length > 0 && (qrl.$captureRef$ = qrl.$capture$.map(getObject), qrl.$capture$ = null);
  }
};
const WatchSerializer = {
  prefix: "",
  test: (v) => {
    return isObject(obj = v) && obj instanceof Watch;
    var obj;
  },
  serialize: (obj, getObjId) => ((watch, getObjId2) => {
    let value = `${intToStr(watch.$flags$)} ${intToStr(watch.$index$)} ${getObjId2(watch.$qrl$)} ${getObjId2(watch.$el$)}`;
    return isResourceWatch(watch) && (value += ` ${getObjId2(watch.$resource$)}`), value;
  })(obj, getObjId),
  prepare: (data) => ((data2) => {
    const [flags, index2, qrl, el, resource] = data2.split(" ");
    return new Watch(strToInt(flags), strToInt(index2), el, qrl, resource);
  })(data),
  fill: (watch, getObject) => {
    watch.$el$ = getObject(watch.$el$), watch.$qrl$ = getObject(watch.$qrl$), watch.$resource$ && (watch.$resource$ = getObject(watch.$resource$));
  }
};
const ResourceSerializer = {
  prefix: "",
  test: (v) => isResourceReturn(v),
  serialize: (obj, getObjId) => ((resource, getObjId2) => {
    const state = resource.state;
    return "resolved" === state ? `0 ${getObjId2(resource.resolved)}` : "pending" === state ? "1" : `2 ${getObjId2(resource.error)}`;
  })(obj, getObjId),
  prepare: (data) => ((data2) => {
    const [first, id] = data2.split(" ");
    const result = _createResourceReturn(void 0);
    return result.promise = Promise.resolve(), "0" === first ? (result.state = "resolved", result.resolved = id) : "1" === first ? (result.state = "pending", result.promise = new Promise(() => {
    })) : "2" === first && (result.state = "rejected", result.error = id), result;
  })(data),
  fill: (resource, getObject) => {
    if ("resolved" === resource.state) {
      resource.resolved = getObject(resource.resolved), resource.promise = Promise.resolve(resource.resolved);
    } else if ("rejected" === resource.state) {
      const p = Promise.reject(resource.error);
      p.catch(() => null), resource.error = getObject(resource.error), resource.promise = p;
    }
  }
};
const URLSerializer = {
  prefix: "",
  test: (v) => v instanceof URL,
  serialize: (obj) => obj.href,
  prepare: (data) => new URL(data),
  fill: void 0
};
const DateSerializer = {
  prefix: "",
  test: (v) => v instanceof Date,
  serialize: (obj) => obj.toISOString(),
  prepare: (data) => new Date(data),
  fill: void 0
};
const RegexSerializer = {
  prefix: "\x07",
  test: (v) => v instanceof RegExp,
  serialize: (obj) => `${obj.flags} ${obj.source}`,
  prepare: (data) => {
    const space = data.indexOf(" ");
    const source = data.slice(space + 1);
    const flags = data.slice(0, space);
    return new RegExp(source, flags);
  },
  fill: void 0
};
const ErrorSerializer = {
  prefix: "",
  test: (v) => v instanceof Error,
  serialize: (obj) => obj.message,
  prepare: (text) => {
    const err = new Error(text);
    return err.stack = void 0, err;
  },
  fill: void 0
};
const DocumentSerializer = {
  prefix: "",
  test: (v) => isDocument(v),
  serialize: void 0,
  prepare: (_, _c, doc) => doc,
  fill: void 0
};
const SERIALIZABLE_STATE = Symbol("serializable-data");
const ComponentSerializer = {
  prefix: "",
  test: (obj) => isQwikComponent(obj),
  serialize: (obj, getObjId, containerState) => {
    const [qrl] = obj[SERIALIZABLE_STATE];
    return stringifyQRL(qrl, {
      $getObjId$: getObjId
    });
  },
  prepare: (data, containerState) => {
    const optionsIndex = data.indexOf("{");
    const qrlString = -1 == optionsIndex ? data : data.slice(0, optionsIndex);
    const qrl = parseQRL(qrlString, containerState.$containerEl$);
    return componentQrl(qrl);
  },
  fill: (component, getObject) => {
    const [qrl] = component[SERIALIZABLE_STATE];
    qrl.$capture$ && qrl.$capture$.length > 0 && (qrl.$captureRef$ = qrl.$capture$.map(getObject), qrl.$capture$ = null);
  }
};
const serializers = [QRLSerializer, WatchSerializer, ResourceSerializer, URLSerializer, DateSerializer, RegexSerializer, ErrorSerializer, DocumentSerializer, ComponentSerializer, {
  prefix: "",
  test: (obj) => "function" == typeof obj && void 0 !== obj.__qwik_serializable__,
  serialize: (obj) => obj.toString(),
  prepare: (data) => {
    const fn = new Function("return " + data)();
    return fn.__qwik_serializable__ = true, fn;
  },
  fill: void 0
}];
const serializeValue = (obj, getObjID, containerState) => {
  for (const s of serializers) {
    if (s.test(obj)) {
      let value = s.prefix;
      return s.serialize && (value += s.serialize(obj, getObjID, containerState)), value;
    }
  }
};
const getOrCreateProxy = (target, containerState, flags = 0) => containerState.$proxyMap$.get(target) || createProxy(target, containerState, flags, void 0);
const createProxy = (target, containerState, flags, subs) => {
  unwrapProxy(target), containerState.$proxyMap$.has(target);
  const manager = containerState.$subsManager$.$getLocal$(target, subs);
  const proxy = new Proxy(target, new ReadWriteProxyHandler(containerState, manager, flags));
  return containerState.$proxyMap$.set(target, proxy), proxy;
};
const QOjectTargetSymbol = Symbol();
const QOjectSubsSymbol = Symbol();
const QOjectFlagsSymbol = Symbol();
class ReadWriteProxyHandler {
  constructor($containerState$, $manager$, $flags$) {
    this.$containerState$ = $containerState$, this.$manager$ = $manager$, this.$flags$ = $flags$;
  }
  get(target, prop) {
    if ("symbol" == typeof prop) {
      return prop === QOjectTargetSymbol ? target : prop === QOjectFlagsSymbol ? this.$flags$ : prop === QOjectSubsSymbol ? this.$manager$.$subs$ : target[prop];
    }
    let subscriber;
    const invokeCtx = tryGetInvokeContext();
    const recursive = 0 != (1 & this.$flags$);
    const immutable = 0 != (2 & this.$flags$);
    invokeCtx && (subscriber = invokeCtx.$subscriber$);
    let value = target[prop];
    if (isMutable(value) ? value = value.mut : immutable && (subscriber = null), subscriber) {
      const isA = isArray(target);
      this.$manager$.$addSub$(subscriber, isA ? void 0 : prop);
    }
    return recursive ? wrap(value, this.$containerState$) : value;
  }
  set(target, prop, newValue) {
    if ("symbol" == typeof prop) {
      return target[prop] = newValue, true;
    }
    if (0 != (2 & this.$flags$)) {
      throw qError(QError_immutableProps);
    }
    const unwrappedNewValue = 0 != (1 & this.$flags$) ? unwrapProxy(newValue) : newValue;
    return isArray(target) ? (target[prop] = unwrappedNewValue, this.$manager$.$notifySubs$(), true) : (target[prop] !== unwrappedNewValue && (target[prop] = unwrappedNewValue, this.$manager$.$notifySubs$(prop)), true);
  }
  has(target, property) {
    return property === QOjectTargetSymbol || property === QOjectFlagsSymbol || Object.prototype.hasOwnProperty.call(target, property);
  }
  ownKeys(target) {
    let subscriber = null;
    const invokeCtx = tryGetInvokeContext();
    return invokeCtx && (subscriber = invokeCtx.$subscriber$), subscriber && this.$manager$.$addSub$(subscriber), Object.getOwnPropertyNames(target);
  }
}
const wrap = (value, containerState) => {
  if (isQrl$1(value)) {
    return value;
  }
  if (isObject(value)) {
    if (Object.isFrozen(value)) {
      return value;
    }
    const nakedValue = unwrapProxy(value);
    return nakedValue !== value || isNode(nakedValue) ? value : shouldSerialize(nakedValue) ? containerState.$proxyMap$.get(value) || getOrCreateProxy(value, containerState, 1) : value;
  }
  return value;
};
const noSerializeSet = /* @__PURE__ */ new WeakSet();
const shouldSerialize = (obj) => !isObject(obj) && !isFunction(obj) || !noSerializeSet.has(obj);
const fastShouldSerialize = (obj) => !noSerializeSet.has(obj);
const noSerialize = (input) => (null != input && noSerializeSet.add(input), input);
const mutable = (v) => new MutableImpl(v);
class MutableImpl {
  constructor(mut) {
    this.mut = mut;
  }
}
const isMutable = (v) => v instanceof MutableImpl;
const unwrapProxy = (proxy) => {
  var _a2;
  return isObject(proxy) ? (_a2 = getProxyTarget(proxy)) != null ? _a2 : proxy : proxy;
};
const getProxyTarget = (obj) => obj[QOjectTargetSymbol];
const getProxySubs = (obj) => obj[QOjectSubsSymbol];
const getProxyFlags = (obj) => {
  if (isObject(obj)) {
    return obj[QOjectFlagsSymbol];
  }
};
const resumeIfNeeded = (containerEl) => {
  "paused" === directGetAttribute(containerEl, "q:container") && (((containerEl2) => {
    if (!isContainer(containerEl2)) {
      return void logWarn();
    }
    const doc = getDocument(containerEl2);
    const script = ((parentElm) => {
      let child = parentElm.lastElementChild;
      for (; child; ) {
        if ("SCRIPT" === child.tagName && "qwik/json" === directGetAttribute(child, "type")) {
          return child;
        }
        child = child.previousElementSibling;
      }
    })(containerEl2 === doc.documentElement ? doc.body : containerEl2);
    if (!script) {
      return void logWarn();
    }
    script.remove();
    const containerState = getContainerState(containerEl2);
    ((containerEl3, containerState2) => {
      const head2 = containerEl3.ownerDocument.head;
      containerEl3.querySelectorAll("style[q\\:style]").forEach((el2) => {
        containerState2.$styleIds$.add(directGetAttribute(el2, "q:style")), head2.appendChild(el2);
      });
    })(containerEl2, containerState);
    const meta = JSON.parse((script.textContent || "{}").replace(/\\x3C(\/?script)/g, "<$1"));
    const elements = /* @__PURE__ */ new Map();
    const getObject = (id) => ((id2, elements2, objs, containerState2) => {
      if ("string" == typeof id2 && id2.length, id2.startsWith("#")) {
        return elements2.has(id2), elements2.get(id2);
      }
      const index2 = strToInt(id2);
      objs.length;
      let obj = objs[index2];
      for (let i = id2.length - 1; i >= 0; i--) {
        const code = id2[i];
        const transform = OBJECT_TRANSFORMS[code];
        if (!transform) {
          break;
        }
        obj = transform(obj, containerState2);
      }
      return obj;
    })(id, elements, meta.objs, containerState);
    let maxId = 0;
    getNodesInScope(containerEl2, hasQId).forEach((el2) => {
      const id = directGetAttribute(el2, "q:id");
      const ctx = getContext(el2);
      ctx.$id$ = id, isElement(el2) && (ctx.$vdom$ = domToVnode(el2)), elements.set("#" + id, el2), maxId = Math.max(maxId, strToInt(id));
    }), containerState.$elementIndex$ = ++maxId;
    const parser = ((getObject2, containerState2, doc2) => {
      const map = /* @__PURE__ */ new Map();
      return {
        prepare(data) {
          for (const s of serializers) {
            const prefix = s.prefix;
            if (data.startsWith(prefix)) {
              const value = s.prepare(data.slice(prefix.length), containerState2, doc2);
              return s.fill && map.set(value, s), value;
            }
          }
          return data;
        },
        fill(obj) {
          const serializer = map.get(obj);
          return !!serializer && (serializer.fill(obj, getObject2, containerState2), true);
        }
      };
    })(getObject, containerState, doc);
    ((objs, subs, getObject2, containerState2, parser2) => {
      for (let i = 0; i < objs.length; i++) {
        const value = objs[i];
        isString(value) && (objs[i] = value === UNDEFINED_PREFIX ? void 0 : parser2.prepare(value));
      }
      for (let i = 0; i < subs.length; i++) {
        const value = objs[i];
        const sub = subs[i];
        if (sub) {
          const converted = /* @__PURE__ */ new Map();
          let flags = 0;
          for (const key of Object.keys(sub)) {
            const v = sub[key];
            if ("$" === key) {
              flags = v;
              continue;
            }
            const el2 = getObject2(key);
            if (!el2) {
              continue;
            }
            const set = null === v ? null : new Set(v);
            converted.set(el2, set);
          }
          createProxy(value, containerState2, flags, converted);
        }
      }
    })(meta.objs, meta.subs, getObject, containerState, parser);
    for (const obj of meta.objs) {
      reviveNestedObjects(obj, getObject, parser);
    }
    for (const elementID of Object.keys(meta.ctx)) {
      elementID.startsWith("#");
      const ctxMeta = meta.ctx[elementID];
      const el2 = elements.get(elementID);
      const ctx = getContext(el2);
      const refMap = ctxMeta.r;
      const seq = ctxMeta.s;
      const host = ctxMeta.h;
      const contexts = ctxMeta.c;
      const watches = ctxMeta.w;
      if (refMap && (isElement(el2), ctx.$refMap$ = refMap.split(" ").map(getObject), ctx.li = getDomListeners(ctx, containerEl2)), seq && (ctx.$seq$ = seq.split(" ").map(getObject)), watches && (ctx.$watches$ = watches.split(" ").map(getObject)), contexts) {
        ctx.$contexts$ = /* @__PURE__ */ new Map();
        for (const part of contexts.split(" ")) {
          const [key, value] = part.split("=");
          ctx.$contexts$.set(key, getObject(value));
        }
      }
      if (host) {
        const [props, renderQrl] = host.split(" ");
        const styleIds = el2.getAttribute("q:sstyle");
        ctx.$scopeIds$ = styleIds ? styleIds.split(" ") : null, ctx.$mounted$ = true, ctx.$props$ = getObject(props), ctx.$renderQrl$ = getObject(renderQrl);
      }
    }
    var el;
    directSetAttribute(containerEl2, "q:container", "resumed"), (el = containerEl2) && "function" == typeof CustomEvent && el.dispatchEvent(new CustomEvent("qresume", {
      detail: void 0,
      bubbles: true,
      composed: true
    }));
  })(containerEl), appendQwikDevTools(containerEl));
};
const appendQwikDevTools = (containerEl) => {
  containerEl.qwik = {
    pause: () => (async (elmOrDoc, defaultParentJSON) => {
      const doc = getDocument(elmOrDoc);
      const documentElement = doc.documentElement;
      const containerEl2 = isDocument(elmOrDoc) ? documentElement : elmOrDoc;
      if ("paused" === directGetAttribute(containerEl2, "q:container")) {
        throw qError(QError_containerAlreadyPaused);
      }
      const parentJSON = containerEl2 === doc.documentElement ? doc.body : containerEl2;
      const data = await (async (containerEl3) => {
        const containerState = getContainerState(containerEl3);
        const contexts = getNodesInScope(containerEl3, hasQId).map(tryGetContext);
        return _pauseFromContexts(contexts, containerState);
      })(containerEl2);
      const script = doc.createElement("script");
      return directSetAttribute(script, "type", "qwik/json"), script.textContent = JSON.stringify(data.state, void 0, void 0).replace(/<(\/?script)/g, "\\x3C$1"), parentJSON.appendChild(script), directSetAttribute(containerEl2, "q:container", "paused"), data;
    })(containerEl),
    state: getContainerState(containerEl)
  };
};
const tryGetContext = (element) => element._qc_;
const getContext = (element) => {
  let ctx = tryGetContext(element);
  return ctx || (element._qc_ = ctx = {
    $dirty$: false,
    $mounted$: false,
    $attachedListeners$: false,
    $id$: "",
    $element$: element,
    $refMap$: [],
    li: {},
    $watches$: null,
    $seq$: null,
    $slots$: null,
    $scopeIds$: null,
    $appendStyles$: null,
    $props$: null,
    $vdom$: null,
    $renderQrl$: null,
    $contexts$: null
  }), ctx;
};
const cleanupContext = (ctx, subsManager) => {
  var _a2;
  const el = ctx.$element$;
  (_a2 = ctx.$watches$) == null ? void 0 : _a2.forEach((watch) => {
    subsManager.$clearSub$(watch), destroyWatch(watch);
  }), ctx.$renderQrl$ && subsManager.$clearSub$(el), ctx.$renderQrl$ = null, ctx.$seq$ = null, ctx.$watches$ = null, ctx.$dirty$ = false, el._qc_ = void 0;
};
const PREFIXES = ["on", "window:on", "document:on"];
const SCOPED = ["on", "on-window", "on-document"];
const normalizeOnProp = (prop) => {
  let scope = "on";
  for (let i = 0; i < PREFIXES.length; i++) {
    const prefix = PREFIXES[i];
    if (prop.startsWith(prefix)) {
      scope = SCOPED[i], prop = prop.slice(prefix.length);
      break;
    }
  }
  return scope + ":" + (prop.startsWith("-") ? fromCamelToKebabCase(prop.slice(1)) : prop.toLowerCase());
};
const createProps = (target, containerState) => createProxy(target, containerState, 2);
const getPropsMutator = (ctx, containerState) => {
  let props = ctx.$props$;
  props || (ctx.$props$ = props = createProps({}, containerState));
  const target = getProxyTarget(props);
  const manager = containerState.$subsManager$.$getLocal$(target);
  return {
    set(prop, value) {
      let oldValue = target[prop];
      isMutable(oldValue) && (oldValue = oldValue.mut), containerState.$mutableProps$ ? isMutable(value) ? (value = value.mut, target[prop] = value) : target[prop] = mutable(value) : (target[prop] = value, isMutable(value) && (value = value.mut, true)), oldValue !== value && manager.$notifySubs$(prop);
    }
  };
};
const inflateQrl = (qrl, elCtx) => (qrl.$capture$, qrl.$captureRef$ = qrl.$capture$.map((idx) => {
  const int = parseInt(idx, 10);
  const obj = elCtx.$refMap$[int];
  return elCtx.$refMap$.length, obj;
}));
const logError = (message, ...optionalParams) => {
  const err = message instanceof Error ? message : new Error(message);
  return "function" == typeof globalThis._handleError && message instanceof Error ? globalThis._handleError(message, optionalParams) : console.error("%cQWIK ERROR", "", err.message, ...printParams(optionalParams), err.stack), err;
};
const logErrorAndStop = (message, ...optionalParams) => logError(message, ...optionalParams);
const logWarn = (message, ...optionalParams) => {
};
const printParams = (optionalParams) => optionalParams;
const QError_stringifyClassOrStyle = 0;
const QError_verifySerializable = 3;
const QError_setProperty = 6;
const QError_notFoundContext = 13;
const QError_useMethodOutsideContext = 14;
const QError_immutableProps = 17;
const QError_useInvokeContext = 20;
const QError_containerAlreadyPaused = 21;
const QError_invalidJsxNodeType = 25;
const QError_trackUseStore = 26;
const QError_missingObjectId = 27;
const qError = (code, ...parts) => {
  const text = codeToText(code);
  return logErrorAndStop(text, ...parts);
};
const codeToText = (code) => `Code(${code})`;
const isQrl$1 = (value) => "function" == typeof value && "function" == typeof value.getSymbol;
const createQRL = (chunk, symbol, symbolRef, symbolFn, capture, captureRef, refSymbol) => {
  let _containerEl;
  const setContainer = (el) => {
    _containerEl || (_containerEl = el);
  };
  const resolve = async (containerEl) => {
    if (containerEl && setContainer(containerEl), symbolRef) {
      return symbolRef;
    }
    if (symbolFn) {
      return symbolRef = symbolFn().then((module) => symbolRef = module[symbol]);
    }
    {
      if (!_containerEl) {
        throw new Error(`QRL '${chunk}#${symbol || "default"}' does not have an attached container`);
      }
      const symbol2 = getPlatform().importSymbol(_containerEl, chunk, symbol);
      return symbolRef = then(symbol2, (ref) => symbolRef = ref);
    }
  };
  const resolveLazy = (containerEl) => symbolRef || resolve(containerEl);
  const invokeFn = (currentCtx, beforeFn) => (...args) => {
    const fn = resolveLazy();
    return then(fn, (fn2) => {
      if (isFunction(fn2)) {
        if (beforeFn && false === beforeFn()) {
          return;
        }
        const context = {
          ...createInvokationContext(currentCtx),
          $qrl$: QRL
        };
        return emitUsedSymbol(symbol, context.$element$), invoke(context, fn2, ...args);
      }
      throw qError(10);
    });
  };
  const createInvokationContext = (invoke2) => null == invoke2 ? newInvokeContext() : isArray(invoke2) ? newInvokeContextFromTuple(invoke2) : invoke2;
  const invokeQRL = async function(...args) {
    const fn = invokeFn();
    return await fn(...args);
  };
  const resolvedSymbol = refSymbol != null ? refSymbol : symbol;
  const hash = getSymbolHash$1(resolvedSymbol);
  const QRL = invokeQRL;
  const methods = {
    getSymbol: () => resolvedSymbol,
    getHash: () => hash,
    resolve,
    $resolveLazy$: resolveLazy,
    $setContainer$: setContainer,
    $chunk$: chunk,
    $symbol$: symbol,
    $refSymbol$: refSymbol,
    $hash$: hash,
    getFn: invokeFn,
    $capture$: capture,
    $captureRef$: captureRef
  };
  return Object.assign(invokeQRL, methods);
};
const getSymbolHash$1 = (symbolName) => {
  const index2 = symbolName.lastIndexOf("_");
  return index2 > -1 ? symbolName.slice(index2 + 1) : symbolName;
};
const emitUsedSymbol = (symbol, element) => {
  isServer$1() || "object" != typeof document || document.dispatchEvent(new CustomEvent("qsymbol", {
    bubbles: false,
    detail: {
      symbol,
      element,
      timestamp: performance.now()
    }
  }));
};
let runtimeSymbolId = 0;
const inlinedQrl = (symbol, symbolName, lexicalScopeCapture = EMPTY_ARRAY$1) => createQRL("/inlinedQRL", symbolName, symbol, null, null, lexicalScopeCapture, null);
const stringifyQRL = (qrl, opts = {}) => {
  var _a2;
  let symbol = qrl.$symbol$;
  let chunk = qrl.$chunk$;
  const refSymbol = (_a2 = qrl.$refSymbol$) != null ? _a2 : symbol;
  const platform = getPlatform();
  if (platform) {
    const result = platform.chunkForSymbol(refSymbol);
    result && (chunk = result[1], qrl.$refSymbol$ || (symbol = result[0]));
  }
  chunk.startsWith("./") && (chunk = chunk.slice(2));
  const parts = [chunk];
  symbol && "default" !== symbol && parts.push("#", symbol);
  const capture = qrl.$capture$;
  const captureRef = qrl.$captureRef$;
  if (captureRef && captureRef.length) {
    if (opts.$getObjId$) {
      const capture2 = captureRef.map(opts.$getObjId$);
      parts.push(`[${capture2.join(" ")}]`);
    } else if (opts.$addRefMap$) {
      const capture2 = captureRef.map(opts.$addRefMap$);
      parts.push(`[${capture2.join(" ")}]`);
    }
  } else {
    capture && capture.length > 0 && parts.push(`[${capture.join(" ")}]`);
  }
  return parts.join("");
};
const serializeQRLs = (existingQRLs, elCtx) => {
  var value;
  (function(value2) {
    return value2 && "number" == typeof value2.nodeType;
  })(value = elCtx.$element$) && value.nodeType;
  const opts = {
    $element$: elCtx.$element$,
    $addRefMap$: (obj) => addToArray(elCtx.$refMap$, obj)
  };
  return existingQRLs.map((qrl) => stringifyQRL(qrl, opts)).join("\n");
};
const parseQRL = (qrl, containerEl) => {
  const endIdx = qrl.length;
  const hashIdx = indexOf(qrl, 0, "#");
  const captureIdx = indexOf(qrl, hashIdx, "[");
  const chunkEndIdx = Math.min(hashIdx, captureIdx);
  const chunk = qrl.substring(0, chunkEndIdx);
  const symbolStartIdx = hashIdx == endIdx ? hashIdx : hashIdx + 1;
  const symbolEndIdx = captureIdx;
  const symbol = symbolStartIdx == symbolEndIdx ? "default" : qrl.substring(symbolStartIdx, symbolEndIdx);
  const captureStartIdx = captureIdx;
  const captureEndIdx = endIdx;
  const capture = captureStartIdx === captureEndIdx ? EMPTY_ARRAY$1 : qrl.substring(captureStartIdx + 1, captureEndIdx - 1).split(" ");
  "/runtimeQRL" === chunk && logError(codeToText(2), qrl);
  const iQrl = createQRL(chunk, symbol, null, null, capture, null, null);
  return containerEl && iQrl.$setContainer$(containerEl), iQrl;
};
const indexOf = (text, startIdx, char) => {
  const endIdx = text.length;
  const charIdx = text.indexOf(char, startIdx == endIdx ? 0 : startIdx);
  return -1 == charIdx ? endIdx : charIdx;
};
const addToArray = (array, obj) => {
  const index2 = array.indexOf(obj);
  return -1 === index2 ? (array.push(obj), array.length - 1) : index2;
};
const $ = (expression) => ((symbol, lexicalScopeCapture = EMPTY_ARRAY$1) => createQRL("/runtimeQRL", "s" + runtimeSymbolId++, symbol, null, null, lexicalScopeCapture, null))(expression);
const componentQrl = (onRenderQrl) => {
  function QwikComponent(props, key) {
    const hash = onRenderQrl.$hash$;
    return jsx(Virtual, {
      "q:renderFn": onRenderQrl,
      ...props
    }, hash + ":" + (key || ""));
  }
  return QwikComponent[SERIALIZABLE_STATE] = [onRenderQrl], QwikComponent;
};
const isQwikComponent = (component) => "function" == typeof component && void 0 !== component[SERIALIZABLE_STATE];
const Slot = (props) => {
  var _a2;
  const name = (_a2 = props.name) != null ? _a2 : "";
  return jsx(Virtual, {
    "q:s": ""
  }, name);
};
const renderSSR = async (node, opts) => {
  var _a2;
  const root = opts.containerTagName;
  const containerEl = createContext(1).$element$;
  const containerState = createContainerState(containerEl);
  const rctx = createRenderContext({
    nodeType: 9
  }, containerState);
  const headNodes = (_a2 = opts.beforeContent) != null ? _a2 : [];
  const ssrCtx = {
    rctx,
    $contexts$: [],
    projectedChildren: void 0,
    projectedContext: void 0,
    hostCtx: void 0,
    invocationContext: void 0,
    headNodes: "html" === root ? headNodes : []
  };
  const containerAttributes = {
    ...opts.containerAttributes,
    "q:container": "paused",
    "q:version": "0.9.0",
    "q:render": "ssr",
    "q:base": opts.base,
    children: "html" === root ? [node] : [headNodes, node]
  };
  containerState.$envData$ = {
    url: opts.url,
    ...opts.envData
  }, node = jsx(root, containerAttributes), containerState.$hostsRendering$ = /* @__PURE__ */ new Set(), containerState.$renderPromise$ = Promise.resolve().then(() => renderRoot(node, ssrCtx, opts.stream, containerState, opts)), await containerState.$renderPromise$;
};
const renderRoot = async (node, ssrCtx, stream, containerState, opts) => {
  const beforeClose = opts.beforeClose;
  return await renderNode(node, ssrCtx, stream, 0, beforeClose ? (stream2) => {
    const result = beforeClose(ssrCtx.$contexts$, containerState);
    return processData(result, ssrCtx, stream2, 0, void 0);
  } : void 0), ssrCtx.rctx.$static$;
};
const renderNodeVirtual = (node, elCtx, extraNodes, ssrCtx, stream, flags, beforeClose) => {
  var _a2;
  const props = node.props;
  const renderQrl = props["q:renderFn"];
  if (renderQrl) {
    return elCtx.$renderQrl$ = renderQrl, renderSSRComponent(ssrCtx, stream, elCtx, node, flags, beforeClose);
  }
  let virtualComment = "<!--qv" + renderVirtualAttributes(props);
  const isSlot = "q:s" in props;
  const key = null != node.key ? String(node.key) : null;
  if (isSlot && ((_a2 = ssrCtx.hostCtx) == null ? void 0 : _a2.$id$, virtualComment += " q:sref=" + ssrCtx.hostCtx.$id$), null != key && (virtualComment += " q:key=" + key), virtualComment += "-->", stream.write(virtualComment), extraNodes) {
    for (const node2 of extraNodes) {
      renderNodeElementSync(node2.type, node2.props, stream);
    }
  }
  const promise = walkChildren(props.children, ssrCtx, stream, flags);
  return then(promise, () => {
    var _a3;
    if (!isSlot && !beforeClose) {
      return void stream.write(CLOSE_VIRTUAL);
    }
    let promise2;
    if (isSlot) {
      const content = (_a3 = ssrCtx.projectedChildren) == null ? void 0 : _a3[key];
      content && (ssrCtx.projectedChildren[key] = void 0, promise2 = processData(content, ssrCtx.projectedContext, stream, flags));
    }
    return beforeClose && (promise2 = then(promise2, () => beforeClose(stream))), then(promise2, () => {
      stream.write(CLOSE_VIRTUAL);
    });
  });
};
const CLOSE_VIRTUAL = "<!--/qv-->";
const renderVirtualAttributes = (attributes) => {
  let text = "";
  for (const prop of Object.keys(attributes)) {
    if ("children" === prop) {
      continue;
    }
    const value = attributes[prop];
    null != value && (text += " " + ("" === value ? prop : prop + "=" + value));
  }
  return text;
};
const renderNodeElementSync = (tagName, attributes, stream) => {
  if (stream.write("<" + tagName + ((attributes2) => {
    let text = "";
    for (const prop of Object.keys(attributes2)) {
      if ("dangerouslySetInnerHTML" === prop) {
        continue;
      }
      const value = attributes2[prop];
      null != value && (text += " " + ("" === value ? prop : prop + '="' + value + '"'));
    }
    return text;
  })(attributes) + ">"), !!emptyElements[tagName]) {
    return;
  }
  const innerHTML = attributes.dangerouslySetInnerHTML;
  null != innerHTML && stream.write(innerHTML), stream.write(`</${tagName}>`);
};
const renderSSRComponent = (ssrCtx, stream, elCtx, node, flags, beforeClose) => (setComponentProps(ssrCtx.rctx, elCtx, node.props), then(executeComponent(ssrCtx.rctx, elCtx), (res) => {
  const hostElement = elCtx.$element$;
  const newCtx = res.rctx;
  const invocationContext = newInvokeContext(hostElement, void 0);
  invocationContext.$subscriber$ = hostElement, invocationContext.$renderCtx$ = newCtx;
  const projectedContext = {
    ...ssrCtx,
    rctx: newCtx
  };
  const newSSrContext = {
    ...ssrCtx,
    projectedChildren: splitProjectedChildren(node.props.children, ssrCtx),
    projectedContext,
    rctx: newCtx,
    invocationContext
  };
  const extraNodes = [];
  if (elCtx.$appendStyles$) {
    const array = 4 & flags ? ssrCtx.headNodes : extraNodes;
    for (const style of elCtx.$appendStyles$) {
      array.push(jsx("style", {
        "q:style": style.styleId,
        dangerouslySetInnerHTML: style.content
      }));
    }
  }
  const newID = getNextIndex(ssrCtx.rctx);
  const scopeId = elCtx.$scopeIds$ ? serializeSStyle(elCtx.$scopeIds$) : void 0;
  const processedNode = jsx(node.type, {
    "q:sstyle": scopeId,
    "q:id": newID,
    children: res.node
  }, node.key);
  return elCtx.$id$ = newID, ssrCtx.$contexts$.push(elCtx), newSSrContext.hostCtx = elCtx, renderNodeVirtual(processedNode, elCtx, extraNodes, newSSrContext, stream, flags, (stream2) => beforeClose ? then(renderQTemplates(newSSrContext, stream2), () => beforeClose(stream2)) : renderQTemplates(newSSrContext, stream2));
}));
const renderQTemplates = (ssrContext, stream) => {
  const projectedChildren = ssrContext.projectedChildren;
  if (projectedChildren) {
    const nodes = Object.keys(projectedChildren).map((slotName) => {
      const value = projectedChildren[slotName];
      if (value) {
        return jsx("q:template", {
          [QSlot]: slotName,
          hidden: "",
          "aria-hidden": "true",
          children: value
        });
      }
    });
    return processData(nodes, ssrContext, stream, 0, void 0);
  }
};
const splitProjectedChildren = (children, ssrCtx) => {
  var _a2;
  const flatChildren = flatVirtualChildren(children, ssrCtx);
  if (null === flatChildren) {
    return;
  }
  const slotMap = {};
  for (const child of flatChildren) {
    let slotName = "";
    isJSXNode(child) && (slotName = (_a2 = child.props[QSlot]) != null ? _a2 : "");
    let array = slotMap[slotName];
    array || (slotMap[slotName] = array = []), array.push(child);
  }
  return slotMap;
};
const createContext = (nodeType) => getContext({
  nodeType,
  _qc_: null
});
const renderNode = (node, ssrCtx, stream, flags, beforeClose) => {
  var _a2;
  const tagName = node.type;
  if ("string" == typeof tagName) {
    const key = node.key;
    const props = node.props;
    const elCtx = createContext(1);
    const isHead = "head" === tagName;
    const hostCtx = ssrCtx.hostCtx;
    let openingElement = "<" + tagName + ((elCtx2, attributes) => {
      let text = "";
      for (const prop of Object.keys(attributes)) {
        if ("children" === prop || "key" === prop || "class" === prop || "className" === prop || "dangerouslySetInnerHTML" === prop) {
          continue;
        }
        const value = attributes[prop];
        if ("ref" === prop) {
          value.current = elCtx2.$element$;
          continue;
        }
        if (isOnProp(prop)) {
          setEvent(elCtx2.li, prop, value);
          continue;
        }
        const attrName = processPropKey(prop);
        const attrValue = processPropValue(attrName, value);
        null != attrValue && (text += " " + ("" === value ? attrName : attrName + '="' + escapeAttr(attrValue) + '"'));
      }
      return text;
    })(elCtx, props);
    let classStr = stringifyClass((_a2 = props.class) != null ? _a2 : props.className);
    if (hostCtx && (hostCtx.$scopeIds$ && (classStr = hostCtx.$scopeIds$.join(" ") + " " + classStr), !hostCtx.$attachedListeners$)) {
      hostCtx.$attachedListeners$ = true;
      for (const eventName of Object.keys(hostCtx.li)) {
        addQRLListener(elCtx.li, eventName, hostCtx.li[eventName]);
      }
    }
    isHead && (flags |= 1), classStr = classStr.trim(), classStr && (openingElement += ' class="' + classStr + '"');
    const listeners = Object.keys(elCtx.li);
    for (const key2 of listeners) {
      openingElement += " " + key2 + '="' + serializeQRLs(elCtx.li[key2], elCtx) + '"';
    }
    if (null != key && (openingElement += ' q:key="' + key + '"'), "ref" in props || listeners.length > 0) {
      const newID = getNextIndex(ssrCtx.rctx);
      openingElement += ' q:id="' + newID + '"', elCtx.$id$ = newID, ssrCtx.$contexts$.push(elCtx);
    }
    if (1 & flags && (openingElement += " q:head"), openingElement += ">", stream.write(openingElement), emptyElements[tagName]) {
      return;
    }
    const innerHTML = props.dangerouslySetInnerHTML;
    if (null != innerHTML) {
      return stream.write(String(innerHTML)), void stream.write(`</${tagName}>`);
    }
    isHead || (flags &= -2), "html" === tagName ? flags |= 4 : flags &= -5;
    const promise = processData(props.children, ssrCtx, stream, flags);
    return then(promise, () => {
      if (isHead) {
        for (const node2 of ssrCtx.headNodes) {
          renderNodeElementSync(node2.type, node2.props, stream);
        }
        ssrCtx.headNodes.length = 0;
      }
      if (beforeClose) {
        return then(beforeClose(stream), () => {
          stream.write(`</${tagName}>`);
        });
      }
      stream.write(`</${tagName}>`);
    });
  }
  if (tagName === Virtual) {
    const elCtx = createContext(111);
    return renderNodeVirtual(node, elCtx, void 0, ssrCtx, stream, flags, beforeClose);
  }
  if (tagName === SSRComment) {
    return void stream.write("<!--" + node.props.data + "-->");
  }
  if (tagName === InternalSSRStream) {
    return (async (node2, ssrCtx2, stream2, flags2) => {
      stream2.write("<!--qkssr-f-->");
      const generator = node2.props.children;
      let value;
      if (isFunction(generator)) {
        const v = generator({
          write(chunk) {
            stream2.write(chunk), stream2.write("<!--qkssr-f-->");
          }
        });
        if (isPromise(v)) {
          return v;
        }
        value = v;
      } else {
        value = generator;
      }
      for await (const chunk of value) {
        await processData(chunk, ssrCtx2, stream2, flags2, void 0), stream2.write("<!--qkssr-f-->");
      }
    })(node, ssrCtx, stream, flags);
  }
  const res = invoke(ssrCtx.invocationContext, tagName, node.props, node.key);
  return processData(res, ssrCtx, stream, flags, beforeClose);
};
const processData = (node, ssrCtx, stream, flags, beforeClose) => {
  if (null != node && "boolean" != typeof node) {
    if (isString(node) || "number" == typeof node) {
      stream.write(escapeHtml(String(node)));
    } else {
      if (isJSXNode(node)) {
        return renderNode(node, ssrCtx, stream, flags, beforeClose);
      }
      if (isArray(node)) {
        return walkChildren(node, ssrCtx, stream, flags);
      }
      if (isPromise(node)) {
        return stream.write("<!--qkssr-f-->"), node.then((node2) => processData(node2, ssrCtx, stream, flags, beforeClose));
      }
    }
  }
};
function walkChildren(children, ssrContext, stream, flags) {
  if (null == children) {
    return;
  }
  if (!isArray(children)) {
    return processData(children, ssrContext, stream, flags);
  }
  if (1 === children.length) {
    return processData(children[0], ssrContext, stream, flags);
  }
  if (0 === children.length) {
    return;
  }
  let currentIndex = 0;
  const buffers = [];
  return children.reduce((prevPromise, child, index2) => {
    const buffer = [];
    buffers.push(buffer);
    const rendered = processData(child, ssrContext, prevPromise ? {
      write(chunk) {
        currentIndex === index2 ? stream.write(chunk) : buffer.push(chunk);
      }
    } : stream, flags);
    return isPromise(rendered) || prevPromise ? then(rendered, () => then(prevPromise, () => {
      currentIndex++, buffers.length > currentIndex && buffers[currentIndex].forEach((chunk) => stream.write(chunk));
    })) : void currentIndex++;
  }, void 0);
}
const flatVirtualChildren = (children, ssrCtx) => {
  if (null == children) {
    return null;
  }
  const result = _flatVirtualChildren(children, ssrCtx);
  const nodes = isArray(result) ? result : [result];
  return 0 === nodes.length ? null : nodes;
};
const stringifyClass = (str) => {
  if (!str) {
    return "";
  }
  if ("string" == typeof str) {
    return str;
  }
  if (Array.isArray(str)) {
    return str.join(" ");
  }
  const output = [];
  for (const key in str) {
    Object.prototype.hasOwnProperty.call(str, key) && str[key] && output.push(key);
  }
  return output.join(" ");
};
const _flatVirtualChildren = (children, ssrCtx) => {
  if (null == children) {
    return null;
  }
  if (isArray(children)) {
    return children.flatMap((c) => _flatVirtualChildren(c, ssrCtx));
  }
  if (isJSXNode(children) && isFunction(children.type) && children.type !== SSRComment && children.type !== InternalSSRStream && children.type !== Virtual) {
    const res = invoke(ssrCtx.invocationContext, children.type, children.props, children.key);
    return flatVirtualChildren(res, ssrCtx);
  }
  return children;
};
const setComponentProps = (rctx, ctx, expectProps) => {
  const keys = Object.keys(expectProps);
  if (0 === keys.length) {
    return;
  }
  const target = {};
  ctx.$props$ = createProps(target, rctx.$static$.$containerState$);
  for (const key of keys) {
    "children" !== key && "q:renderFn" !== key && (target[key] = expectProps[key]);
  }
};
function processPropKey(prop) {
  return "htmlFor" === prop ? "for" : prop;
}
function processPropValue(prop, value) {
  return "style" === prop ? stringifyStyle(value) : false === value || null == value ? null : true === value ? "" : String(value);
}
const emptyElements = {
  area: true,
  base: true,
  basefont: true,
  bgsound: true,
  br: true,
  col: true,
  embed: true,
  frame: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};
const ESCAPE_HTML = /[&<>]/g;
const ESCAPE_ATTRIBUTES = /[&"]/g;
const escapeHtml = (s) => s.replace(ESCAPE_HTML, (c) => {
  switch (c) {
    case "&":
      return "&amp;";
    case "<":
      return "&lt;";
    case ">":
      return "&gt;";
    default:
      return "";
  }
});
const escapeAttr = (s) => s.replace(ESCAPE_ATTRIBUTES, (c) => {
  switch (c) {
    case "&":
      return "&amp;";
    case '"':
      return "&quot;";
    default:
      return "";
  }
});
const useStore = (initialState, opts) => {
  var _a2;
  const { get, set, ctx } = useSequentialScope();
  if (null != get) {
    return get;
  }
  const value = isFunction(initialState) ? initialState() : initialState;
  if (false === (opts == null ? void 0 : opts.reactive)) {
    return set(value), value;
  }
  {
    const containerState = ctx.$renderCtx$.$static$.$containerState$;
    const newStore = createProxy(value, containerState, ((_a2 = opts == null ? void 0 : opts.recursive) != null ? _a2 : false) ? 1 : 0, void 0);
    return set(newStore), newStore;
  }
};
function useEnvData(key, defaultValue) {
  var _a2;
  return (_a2 = useInvokeContext().$renderCtx$.$static$.$containerState$.$envData$[key]) != null ? _a2 : defaultValue;
}
const JobPosition = /* @__PURE__ */ componentQrl(inlinedQrl(({ image, name, description: description2, from, to, role, link }) => {
  return /* @__PURE__ */ jsx("a", {
    href: link,
    target: "_blank",
    children: /* @__PURE__ */ jsx("div", {
      class: "flex flex-row",
      children: [
        /* @__PURE__ */ jsx("div", {
          class: "flex items-center justify-center p-4",
          children: /* @__PURE__ */ jsx("div", {
            class: "w-14 h-14",
            children: /* @__PURE__ */ jsx("img", {
              src: image,
              alt: ""
            })
          })
        }),
        /* @__PURE__ */ jsx("div", {
          class: "flex flex-col",
          children: [
            /* @__PURE__ */ jsx("div", {
              class: "text-bold text-xl pb-2",
              children: name
            }),
            /* @__PURE__ */ jsx("div", {
              class: "text-bold text-sm pb-2",
              children: role
            }),
            /* @__PURE__ */ jsx("span", {
              class: "text-bold text-sm text-gray-500 pb-2",
              children: `${from} - ${to}`
            }),
            /* @__PURE__ */ jsx("div", {
              class: "text-bold text-sm text-gray-600 pb-2",
              children: description2
            })
          ]
        })
      ]
    })
  });
}, "s_3nmkaWu7nDY"));
const CurrentJobs = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "flex flex-col items-center",
    children: [
      /* @__PURE__ */ jsx("h2", {
        class: "text-xl font-bold pb-4 pt-4",
        children: "Current Job"
      }),
      /* @__PURE__ */ jsx("div", {
        class: "grid lg:grid-cols-3 w-full",
        children: [
          /* @__PURE__ */ jsx(JobPosition, {
            name: "KNOBS Srl",
            role: "Chief Technology Officer",
            description: "Software House & Tech Advisory firm specialized in Web-IoT applications and systems based on blockchain technology",
            image: "https://pbs.twimg.com/profile_images/1225071653459238914/OiZpNqAL_400x400.png",
            link: "https://knobs.it",
            from: "sep. 2018",
            to: "now"
          }),
          /* @__PURE__ */ jsx(JobPosition, {
            name: "Satellite.im",
            role: "Chief Technology Officer & Blockchain Lead",
            description: "Multi platform, decentralized and privacy focused messaging application build on top of blockchain, IPFS and peer-to-peer connections",
            image: "https://pbs.twimg.com/profile_images/1397668569467531266/47JoP9A2_400x400.jpg",
            link: "https://satellite.im",
            from: "dec. 2020",
            to: "now"
          }),
          /* @__PURE__ */ jsx(JobPosition, {
            name: "BCode Srl",
            role: "Solution Architect",
            description: "Blockchain focused tech firm that develops many applications to give companies easy access and frictionless onboarding to the blockchain",
            image: "https://bcode.cloud/wp-content/uploads/2022/08/bcode-logo-2.png",
            link: "https://bcode.cloud",
            from: "nov. 2020",
            to: "now"
          })
        ]
      })
    ]
  });
}, "s_iJSF1Tq5LZs"));
const CSS3 = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 512 512",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "m480 32-64 368-223.3 80L0 400l19.6-94.8h82l-8 40.6L210 390.2l134.1-44.4 18.8-97.1H29.5l16-82h333.7l10.5-52.7H56.3l16.3-82H480z",
    fill: "#1A202C",
    stroke: "none"
  })
});
const Docker = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 640 512",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "M349.9 236.3h-66.1v-59.4h66.1v59.4zm0-204.3h-66.1v60.7h66.1V32zm78.2 144.8H362v59.4h66.1v-59.4zm-156.3-72.1h-66.1v60.1h66.1v-60.1zm78.1 0h-66.1v60.1h66.1v-60.1zm276.8 100c-14.4-9.7-47.6-13.2-73.1-8.4-3.3-24-16.7-44.9-41.1-63.7l-14-9.3-9.3 14c-18.4 27.8-23.4 73.6-3.7 103.8-8.7 4.7-25.8 11.1-48.4 10.7H2.4c-8.7 50.8 5.8 116.8 44 162.1 37.1 43.9 92.7 66.2 165.4 66.2 157.4 0 273.9-72.5 328.4-204.2 21.4.4 67.6.1 91.3-45.2 1.5-2.5 6.6-13.2 8.5-17.1l-13.3-8.9zm-511.1-27.9h-66v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm-78.1-72.1h-66.1v60.1h66.1v-60.1z",
    fill: "#1A202C",
    stroke: "none"
  })
});
const Ethereum = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  viewBox: "0 0 320 512",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  "stroke-width": 0,
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "M311.9 260.8 160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4 8 290.6 160 512l152-221.4-152 92.8z",
    fill: "#1A202C",
    stroke: "none"
  })
});
const Gatsby = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 24 24",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: [
    /* @__PURE__ */ jsx("title", {}),
    /* @__PURE__ */ jsx("path", {
      d: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 2.571c3.171 0 5.915 1.543 7.629 3.858l-1.286 1.115C16.886 5.572 14.571 4.286 12 4.286c-3.343 0-6.171 2.143-7.286 5.143l9.857 9.857c2.486-.857 4.373-3 4.973-5.572h-4.115V12h6c0 4.457-3.172 8.228-7.372 9.17L2.83 9.944C3.772 5.743 7.543 2.57 12 2.57zm-9.429 9.6 9.344 9.258c-2.4-.086-4.801-.943-6.601-2.743-1.8-1.8-2.743-4.201-2.743-6.515z",
      fill: "#1A202C",
      stroke: "none"
    })
  ]
});
const HTML5 = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 384 512",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "m0 32 34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z",
    fill: "#1A202C",
    stroke: "none"
  })
});
const Javascript = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 448 512",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z",
    fill: "#1A202C",
    stroke: "none"
  })
});
const MongoDB = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 32 32",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "M22.797 14.562a13.663 13.663 0 0 0-.407-2.297c-.625-2.369-1.666-4.637-3.134-6.603a16.58 16.58 0 0 0-1.294-1.532c-.476-.499-1.004-.957-1.336-1.578-.21-.393-.41-.791-.614-1.187-.003.124-.011.248-.011.371 0-.124.009-.248.011-.372l-.13-.327c-.022.075-.036.101-.036.129-.017.645-.383 1.083-.838 1.492-.512.46-.989.959-1.481 1.441.017.022.036.044.055.066-.019-.022-.038-.043-.055-.066-1.463 1.924-2.752 3.981-3.511 6.29a14.691 14.691 0 0 0-.517 2.056c-.259 1.481-.379 2.92-.296 4.42.046.829.191 1.645.407 2.448.785 2.917 2.379 5.336 4.558 7.392.405.382.842.729 1.265 1.093l.003-.011-.003.011.187.642.174.996.083 1.039c-.001.211-.01.423.003.633.003.054.074.104.113.156l.004-.006-.004.006.353.124.367.143a322.63 322.63 0 0 0-.063-.924l-.003-.91-.021.021.021-.021.127-1.386.092-.302.263-.467c.325-.262.674-.499.971-.79.536-.527 1.071-1.06 1.55-1.637a12.294 12.294 0 0 0 1.588-2.441c1.223-2.491 1.789-5.269 1.564-8.039l-.006-.074z",
    fill: "#1A202C",
    stroke: "none"
  })
});
const MySQL = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 32 32",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "M5.082 5.593c-.564.564-.423 1.213.564 2.679.508.761 1.1 1.946 1.326 2.623.226.705.677 1.664.987 2.143.564.79.564.959.197 2.397-.226.902-.31 2.031-.197 2.736.169 1.185 1.128 2.905 1.72 3.102.508.169 1.241-.733 1.269-1.551 0-.705.028-.733.338-.226.536.874 2.228 2.735 2.369 2.594.056-.056-.31-.79-.846-1.607-.508-.846-1.1-1.946-1.325-2.454-.31-.846-.423-.902-.79-.508-.226.226-.508.874-.592 1.466-.226 1.354-.733 1.523-1.128.367s-.395-3.131 0-4.484c.282-.931.254-1.184-.226-1.89-.31-.423-.79-1.438-1.044-2.256-.254-.79-.846-1.974-1.325-2.595-1.1-1.551-1.1-2.115.056-1.89.479.085 1.213.423 1.664.733.423.31 1.156.564 1.607.564 1.354 0 3.723 1.326 5.443 3.046 1.326 1.325 2.002 2.397 3.441 5.302 1.692 3.44 1.833 3.638 2.877 3.976 1.241.423 3.835 2.002 3.835 2.341 0 .113-.649.282-1.438.338-2.115.226-2.313.62-.931 1.861.649.564 1.862 1.438 2.736 1.918l1.579.902-.733-.931c-.423-.508-1.297-1.297-1.974-1.72s-1.213-.874-1.213-.987c0-.113.479-.31 1.072-.395 1.579-.282 2.03-.423 2.03-.705 0-.423-2.848-2.566-4.202-3.159-1.156-.536-1.297-.762-2.792-3.835-1.326-2.82-1.861-3.61-3.553-5.302-2.171-2.171-3.666-3.102-5.584-3.384-.649-.113-1.551-.451-1.946-.733-.931-.705-2.82-.959-3.272-.479z",
    fill: "#1A202C",
    stroke: "none"
  })
});
const Next = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 24 24",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: [
    /* @__PURE__ */ jsx("title", {}),
    /* @__PURE__ */ jsx("path", {
      d: "M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z",
      fill: "#1A202C",
      stroke: "none"
    })
  ]
});
const NodeJs = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 32 32",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "M15.998 28.895a1.94 1.94 0 0 1-.969-.259l-3.086-1.826c-.46-.257-.235-.349-.083-.402.614-.213.739-.262 1.394-.635.069-.038.159-.024.231.018l2.37 1.407a.304.304 0 0 0 .287 0l9.241-5.333a.292.292 0 0 0 .141-.25V10.95a.3.3 0 0 0-.143-.255l-9.237-5.329a.29.29 0 0 0-.285 0l-9.235 5.331a.296.296 0 0 0-.146.253v10.666c0 .102.056.198.145.247l2.532 1.462c1.374.687 2.215-.122 2.215-.935V11.86c0-.149.12-.266.269-.266h1.172c.146 0 .267.117.267.266v10.53c0 1.833-.998 2.885-2.736 2.885-.534 0-.955 0-2.129-.579L5.79 23.301a1.953 1.953 0 0 1-.969-1.686V10.95c0-.693.371-1.339.969-1.684l9.242-5.34a2.023 2.023 0 0 1 1.942 0l9.241 5.34c.599.346.971.992.971 1.684v10.665c0 .693-.372 1.337-.971 1.686l-9.241 5.335a1.942 1.942 0 0 1-.973.259zm2.855-7.348c-4.045 0-4.892-1.857-4.892-3.414 0-.148.118-.266.266-.266h1.195c.133 0 .245.096.265.226.18 1.216.717 1.831 3.164 1.831 1.946 0 2.775-.441 2.775-1.473 0-.596-.234-1.037-3.26-1.334-2.528-.25-4.093-.809-4.093-2.831 0-1.865 1.572-2.977 4.207-2.977 2.961 0 4.425 1.027 4.611 3.233a.27.27 0 0 1-.267.291h-1.2a.266.266 0 0 1-.259-.209c-.288-1.28-.988-1.689-2.886-1.689-2.126 0-2.373.74-2.373 1.295 0 .673.292.869 3.161 1.248 2.84.375 4.19.907 4.19 2.902 0 2.014-1.678 3.167-4.606 3.167z",
    fill: "#1A202C",
    stroke: "none"
  })
});
const Nuxt = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 24 24",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: [
    /* @__PURE__ */ jsx("title", {}),
    /* @__PURE__ */ jsx("path", {
      d: "M9.078 3.965c-.588 0-1.177.289-1.514.867L.236 17.433c-.672 1.156.17 2.601 1.514 2.601h5.72a1.676 1.676 0 0 1-.35-2.117l5.547-9.513-2.076-3.572a1.734 1.734 0 0 0-1.513-.867zm7.407 2.922c-.487 0-.973.236-1.252.709L9.17 17.906c-.557.945.138 2.13 1.251 2.13h12.13c1.114 0 1.81-1.185 1.253-2.13l-6.067-10.31a1.437 1.437 0 0 0-1.252-.71z",
      fill: "#1A202C",
      stroke: "none"
    })
  ]
});
const ProblemSolving = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 512 512",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "m224 96 16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c6.25 6.25 14.44 9.37 22.62 9.37 8.19 0 16.38-3.12 22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z",
    fill: "#1A202C",
    stroke: "none"
  })
});
const React = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 34 32",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: [
    /* @__PURE__ */ jsx("path", {
      d: "M19.314 15.987a2.392 2.392 0 1 1-4.784 0 2.392 2.392 0 0 1 4.784 0z",
      fill: "#1A202C",
      stroke: "none"
    }),
    /* @__PURE__ */ jsx("path", {
      d: "M16.922 24.783c1.878 1.826 3.729 2.906 5.221 2.906.489 0 .952-.103 1.337-.334 1.337-.772 1.826-2.701 1.363-5.453-.077-.489-.18-.977-.309-1.492.514-.154.977-.309 1.44-.463 2.598-1.003 4.038-2.392 4.038-3.909 0-1.543-1.44-2.932-4.038-3.909-.463-.18-.926-.334-1.44-.463.129-.514.232-1.003.309-1.492.437-2.803-.051-4.758-1.389-5.53-.386-.231-.849-.334-1.337-.334-1.466 0-3.344 1.08-5.221 2.906-1.852-1.826-3.704-2.906-5.195-2.906-.489 0-.952.103-1.337.334-1.337.772-1.826 2.701-1.363 5.453.077.489.18.977.309 1.492-.514.154-.977.309-1.44.463-2.598 1.003-4.038 2.392-4.038 3.909 0 1.543 1.44 2.932 4.038 3.909.463.18.926.334 1.44.463a16.882 16.882 0 0 0-.309 1.492c-.437 2.752.051 4.707 1.363 5.453.386.232.849.334 1.337.334 1.492.051 3.344-1.029 5.221-2.829zm-1.441-3.472c.463.026.952.026 1.44.026s.977 0 1.44-.026a24.523 24.523 0 0 1-1.44 1.723 24.252 24.252 0 0 1-1.44-1.723zm-3.189-2.649c.257.437.489.849.772 1.26a27.786 27.786 0 0 1-2.263-.386c.232-.694.489-1.415.797-2.135.206.411.437.849.694 1.26zM10.8 12.463c.72-.154 1.466-.283 2.263-.386-.257.412-.514.823-.772 1.26s-.489.849-.694 1.286a17.109 17.109 0 0 1-.797-2.161zm1.415 3.524c.334-.694.694-1.389 1.106-2.083.386-.669.823-1.337 1.26-2.006a35.293 35.293 0 0 1 4.682 0c.463.669.874 1.337 1.26 2.006.412.694.772 1.389 1.106 2.083a26.922 26.922 0 0 1-1.106 2.083c-.386.669-.823 1.337-1.26 2.006a35.293 35.293 0 0 1-4.682 0 28.695 28.695 0 0 1-1.26-2.006 27.106 27.106 0 0 1-1.106-2.083zm10.057-1.389-.694-1.286c-.257-.437-.489-.849-.772-1.26.797.103 1.543.232 2.263.386-.231.72-.489 1.44-.797 2.161zm0 2.778c.309.72.566 1.44.797 2.135-.72.154-1.466.283-2.263.386.257-.412.514-.823.772-1.26.232-.386.463-.823.694-1.26zm.591 8.925c-.206.129-.463.18-.746.18-1.26 0-2.829-1.029-4.372-2.572a26.868 26.868 0 0 0 2.186-2.701 23.619 23.619 0 0 0 3.447-.54c.129.463.206.926.283 1.389.36 2.186.077 3.755-.797 4.244zm1.338-13.555c2.881.823 4.604 2.083 4.604 3.241 0 1.003-1.183 2.006-3.266 2.804-.412.154-.874.309-1.337.437a27.01 27.01 0 0 0-1.26-3.241c.514-1.106.952-2.186 1.26-3.241zm-2.058-7.253c.283 0 .514.051.746.18.849.489 1.157 2.032.797 4.244-.077.437-.18.9-.283 1.389a33.072 33.072 0 0 0-3.447-.54 23.774 23.774 0 0 0-2.186-2.701c1.543-1.518 3.112-2.572 4.372-2.572zm-3.781 5.17c-.463-.026-.952-.026-1.44-.026s-.977 0-1.44.026c.463-.617.952-1.183 1.44-1.723.489.54.977 1.132 1.44 1.723zm-7.382-4.99c.206-.129.463-.18.746-.18 1.26 0 2.829 1.029 4.372 2.572a26.756 26.756 0 0 0-2.186 2.701 23.619 23.619 0 0 0-3.447.54c-.129-.463-.206-.926-.283-1.389-.36-2.186-.077-3.729.797-4.244zM9.643 19.228c-2.881-.823-4.604-2.083-4.604-3.241 0-1.003 1.183-2.006 3.266-2.803.412-.154.874-.309 1.337-.437a27.01 27.01 0 0 0 1.26 3.241c-.514 1.106-.952 2.212-1.26 3.241zm.54 2.829c.077-.437.18-.9.283-1.389 1.08.232 2.238.412 3.447.54a23.774 23.774 0 0 0 2.186 2.701c-1.543 1.517-3.112 2.572-4.372 2.572-.283 0-.514-.051-.746-.18-.875-.489-1.157-2.058-.797-4.244z",
      fill: "#1A202C",
      stroke: "none"
    })
  ]
});
const Rust = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 24 24",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: [
    /* @__PURE__ */ jsx("title", {}),
    /* @__PURE__ */ jsx("path", {
      d: "m23.835 11.703-1.008-.623a13.727 13.727 0 0 0-.028-.294l.866-.807a.348.348 0 0 0-.116-.578l-1.106-.414a8.496 8.496 0 0 0-.087-.285l.69-.96a.346.346 0 0 0-.226-.544l-1.166-.19a9.357 9.357 0 0 0-.14-.261l.49-1.076a.344.344 0 0 0-.028-.336.349.349 0 0 0-.3-.154l-1.185.041a6.744 6.744 0 0 0-.188-.227l.273-1.153a.347.347 0 0 0-.417-.417l-1.153.273a14.018 14.018 0 0 0-.228-.188l.041-1.184a.344.344 0 0 0-.49-.328l-1.076.49-.262-.14-.19-1.167a.348.348 0 0 0-.545-.226l-.96.69a8.487 8.487 0 0 0-.285-.086L14.597.453a.348.348 0 0 0-.578-.116l-.807.867a9.294 9.294 0 0 0-.294-.028L12.295.168a.346.346 0 0 0-.59 0l-.623 1.008a13.738 13.738 0 0 0-.294.028L9.98.337a.346.346 0 0 0-.578.116l-.414 1.106-.285.086-.959-.69a.348.348 0 0 0-.545.226l-.19 1.167a9.357 9.357 0 0 0-.262.14l-1.076-.49a.346.346 0 0 0-.49.328l.041 1.184a7.983 7.983 0 0 0-.228.187l-1.153-.272a.347.347 0 0 0-.417.417l.271 1.153-.186.227-1.184-.042a.346.346 0 0 0-.328.49l.49 1.077a9.167 9.167 0 0 0-.14.262l-1.166.19a.348.348 0 0 0-.226.544l.69.958a13.303 13.303 0 0 0-.087.286l-1.106.414a.348.348 0 0 0-.116.578l.866.807a9.294 9.294 0 0 0-.028.294l-1.008.623a.344.344 0 0 0 0 .59l1.008.623c.008.098.018.196.028.294l-.866.807a.346.346 0 0 0 .116.578l1.106.415c.028.096.057.191.087.285l-.69.959a.345.345 0 0 0 .227.544l1.166.19c.046.088.092.175.14.262l-.49 1.076a.346.346 0 0 0 .328.49l1.183-.041c.062.077.124.152.187.227l-.27 1.154a.346.346 0 0 0 .416.417l1.153-.272c.075.064.151.126.228.187l-.041 1.184a.344.344 0 0 0 .49.327l1.076-.49c.087.049.174.095.262.14l.19 1.167a.348.348 0 0 0 .545.227l.959-.69a9.299 9.299 0 0 0 .285.086l.414 1.107a.345.345 0 0 0 .578.115l.808-.865.294.03.623 1.006a.347.347 0 0 0 .59 0l.623-1.007c.098-.009.197-.018.294-.03l.807.866a.348.348 0 0 0 .578-.115l.414-1.107a8.463 8.463 0 0 0 .285-.087l.959.69a.345.345 0 0 0 .545-.226l.19-1.166.262-.14 1.076.49a.347.347 0 0 0 .49-.328l-.041-1.184a6.727 6.727 0 0 0 .227-.187l1.153.272a.347.347 0 0 0 .417-.416l-.272-1.155c.063-.075.126-.15.187-.227l1.184.041a.344.344 0 0 0 .328-.49l-.49-1.076c.048-.087.095-.174.141-.262l1.166-.19a.348.348 0 0 0 .226-.544l-.69-.959.087-.285 1.106-.414a.346.346 0 0 0 .116-.579l-.866-.807c.01-.098.02-.196.028-.294l1.008-.624a.344.344 0 0 0 0-.589zm-6.742 8.355a.714.714 0 0 1 .299-1.396.714.714 0 1 1-.3 1.396zm-.342-2.314a.649.649 0 0 0-.771.5l-.358 1.669a8.73 8.73 0 0 1-3.619.78 8.737 8.737 0 0 1-3.695-.815L7.95 18.21a.648.648 0 0 0-.772-.5l-1.473.317a8.722 8.722 0 0 1-.761-.898h7.167c.081 0 .136-.014.136-.088v-2.536c0-.074-.054-.088-.136-.088h-2.096v-1.608h2.268c.206 0 1.106.059 1.393 1.209.09.353.288 1.504.424 1.873.134.413.683 1.238 1.268 1.238h3.572a.75.75 0 0 0 .13-.013 8.787 8.787 0 0 1-.813.952zm-9.914 2.28a.714.714 0 1 1-.3-1.396.714.714 0 0 1 .3 1.396zM4.117 8.997a.714.714 0 1 1-1.303.58.714.714 0 0 1 1.304-.58zm-.834 1.981 1.534-.682a.65.65 0 0 0 .33-.858l-.316-.715h1.244v5.602H3.567a8.775 8.775 0 0 1-.284-3.348zm6.734-.543V8.784h2.96c.153 0 1.08.177 1.08.87 0 .574-.712.78-1.296.78zm10.757 1.486c0 .219-.008.436-.024.651h-.9c-.09 0-.127.059-.127.148v.413c0 .973-.548 1.184-1.03 1.238-.457.052-.964-.191-1.027-.472-.27-1.518-.72-1.843-1.43-2.403.882-.56 1.799-1.386 1.799-2.492 0-1.193-.82-1.945-1.377-2.315-.783-.516-1.65-.62-1.883-.62H5.468a8.765 8.765 0 0 1 4.907-2.77l1.098 1.152a.648.648 0 0 0 .918.02l1.227-1.173a8.775 8.775 0 0 1 6.004 4.276l-.84 1.898a.652.652 0 0 0 .33.859l1.618.718c.028.288.042.577.042.872zm-9.3-9.6a.713.713 0 1 1 .984 1.032.714.714 0 0 1-.984-1.031zm8.339 6.71a.71.71 0 0 1 .939-.362.714.714 0 1 1-.94.364z",
      fill: "#1A202C",
      stroke: "none"
    })
  ]
});
const Sass = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 640 512",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "M301.84 378.92c-.3.6-.6 1.08 0 0zm249.13-87a131.16 131.16 0 0 0-58 13.5c-5.9-11.9-12-22.3-13-30.1-1.2-9.1-2.5-14.5-1.1-25.3s7.7-26.1 7.6-27.2-1.4-6.6-14.3-6.7-24 2.5-25.29 5.9a122.83 122.83 0 0 0-5.3 19.1c-2.3 11.7-25.79 53.5-39.09 75.3-4.4-8.5-8.1-16-8.9-22-1.2-9.1-2.5-14.5-1.1-25.3s7.7-26.1 7.6-27.2-1.4-6.6-14.29-6.7-24 2.5-25.3 5.9-2.7 11.4-5.3 19.1-33.89 77.3-42.08 95.4c-4.2 9.2-7.8 16.6-10.4 21.6-.4.8-.7 1.3-.9 1.7.3-.5.5-1 .5-.8-2.2 4.3-3.5 6.7-3.5 6.7v.1c-1.7 3.2-3.6 6.1-4.5 6.1-.6 0-1.9-8.4.3-19.9 4.7-24.2 15.8-61.8 15.7-63.1-.1-.7 2.1-7.2-7.3-10.7-9.1-3.3-12.4 2.2-13.2 2.2s-1.4 2-1.4 2 10.1-42.4-19.39-42.4c-18.4 0-44 20.2-56.58 38.5-7.9 4.3-25 13.6-43 23.5-6.9 3.8-14 7.7-20.7 11.4-.5-.5-.9-1-1.4-1.5-35.79-38.2-101.87-65.2-99.07-116.5 1-18.7 7.5-67.8 127.07-127.4 98-48.8 176.35-35.4 189.84-5.6 19.4 42.5-41.89 121.6-143.66 133-38.79 4.3-59.18-10.7-64.28-16.3-5.3-5.9-6.1-6.2-8.1-5.1-3.3 1.8-1.2 7 0 10.1 3 7.9 15.5 21.9 36.79 28.9 18.7 6.1 64.18 9.5 119.17-11.8 61.78-23.8 109.87-90.1 95.77-145.6C386.52 18.32 293-.18 204.57 31.22c-52.69 18.7-109.67 48.1-150.66 86.4-48.69 45.6-56.48 85.3-53.28 101.9 11.39 58.9 92.57 97.3 125.06 125.7-1.6.9-3.1 1.7-4.5 2.5-16.29 8.1-78.18 40.5-93.67 74.7-17.5 38.8 2.9 66.6 16.29 70.4 41.79 11.6 84.58-9.3 107.57-43.6s20.2-79.1 9.6-99.5c-.1-.3-.3-.5-.4-.8 4.2-2.5 8.5-5 12.8-7.5 8.29-4.9 16.39-9.4 23.49-13.3-4 10.8-6.9 23.8-8.4 42.6-1.8 22 7.3 50.5 19.1 61.7 5.2 4.9 11.49 5 15.39 5 13.8 0 20-11.4 26.89-25 8.5-16.6 16-35.9 16-35.9s-9.4 52.2 16.3 52.2c9.39 0 18.79-12.1 23-18.3v.1s.2-.4.7-1.2c1-1.5 1.5-2.4 1.5-2.4v-.3c3.8-6.5 12.1-21.4 24.59-46 16.2-31.8 31.69-71.5 31.69-71.5a201.24 201.24 0 0 0 6.2 25.8c2.8 9.5 8.7 19.9 13.4 30-3.8 5.2-6.1 8.2-6.1 8.2a.31.31 0 0 0 .1.2c-3 4-6.4 8.3-9.9 12.5-12.79 15.2-28 32.6-30 37.6-2.4 5.9-1.8 10.3 2.8 13.7 3.4 2.6 9.4 3 15.69 2.5 11.5-.8 19.6-3.6 23.5-5.4a82.2 82.2 0 0 0 20.19-10.6c12.5-9.2 20.1-22.4 19.4-39.8-.4-9.6-3.5-19.2-7.3-28.2 1.1-1.6 2.3-3.3 3.4-5C434.8 301.72 450.1 270 450.1 270a201.24 201.24 0 0 0 6.2 25.8c2.4 8.1 7.09 17 11.39 25.7-18.59 15.1-30.09 32.6-34.09 44.1-7.4 21.3-1.6 30.9 9.3 33.1 4.9 1 11.9-1.3 17.1-3.5a79.46 79.46 0 0 0 21.59-11.1c12.5-9.2 24.59-22.1 23.79-39.6-.3-7.9-2.5-15.8-5.4-23.4 15.7-6.6 36.09-10.2 62.09-7.2 55.68 6.5 66.58 41.3 64.48 55.8s-13.8 22.6-17.7 25-5.1 3.3-4.8 5.1c.5 2.6 2.3 2.5 5.6 1.9 4.6-.8 29.19-11.8 30.29-38.7 1.6-34-31.09-71.4-89-71.1zm-429.18 144.7c-18.39 20.1-44.19 27.7-55.28 21.3C54.61 451 59.31 421.42 82 400c13.8-13 31.59-25 43.39-32.4 2.7-1.6 6.6-4 11.4-6.9.8-.5 1.2-.7 1.2-.7.9-.6 1.9-1.1 2.9-1.7 8.29 30.4.3 57.2-19.1 78.3zm134.36-91.4c-6.4 15.7-19.89 55.7-28.09 53.6-7-1.8-11.3-32.3-1.4-62.3 5-15.1 15.6-33.1 21.9-40.1 10.09-11.3 21.19-14.9 23.79-10.4 3.5 5.9-12.2 49.4-16.2 59.2zm111 53c-2.7 1.4-5.2 2.3-6.4 1.6-.9-.5 1.1-2.4 1.1-2.4s13.9-14.9 19.4-21.7c3.2-4 6.9-8.7 10.89-13.9 0 .5.1 1 .1 1.6-.13 17.9-17.32 30-25.12 34.8zm85.58-19.5c-2-1.4-1.7-6.1 5-20.7 2.6-5.7 8.59-15.3 19-24.5a36.18 36.18 0 0 1 1.9 10.8c-.1 22.5-16.2 30.9-25.89 34.4z",
    fill: "#1A202C",
    stroke: "none"
  })
});
const Solana = (props) => /* @__PURE__ */ jsx("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 250 195.56",
  xmlSpace: "preserve",
  width: 25,
  height: 25,
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "M204.04 48.77H3.86c-3.43 0-5.15-4.05-2.74-6.44L42.95 1.11C43.67.4 44.66 0 45.69 0h200.18c3.43 0 5.15 4.05 2.74 6.44l-41.82 41.21c-.74.71-1.72 1.12-2.75 1.12zM45.96 146.79h200.18c3.43 0 5.15 4.05 2.74 6.44l-41.82 41.21c-.72.71-1.71 1.11-2.74 1.11H4.14c-3.43 0-5.15-4.05-2.74-6.44l41.82-41.21c.73-.71 1.71-1.11 2.74-1.11zm0-25.24h200.18c3.43 0 5.15-4.05 2.74-6.44L207.05 73.9a3.907 3.907 0 0 0-2.74-1.11H4.14c-3.43 0-5.15 4.05-2.74 6.44l41.82 41.21c.73.71 1.71 1.11 2.74 1.11z",
    fill: "#020203",
    style: {
      fill: "#020203"
    }
  })
});
const TeamWork = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 640 512",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z",
    fill: "#1A202C",
    stroke: "none"
  })
});
const Typescript = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 24 24",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: [
    /* @__PURE__ */ jsx("title", {}),
    /* @__PURE__ */ jsx("path", {
      d: "M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z",
      fill: "#1A202C",
      stroke: "none"
    })
  ]
});
const Vue = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 448 512",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "M356.9 64.3H280l-56 88.6-48-88.6H0L224 448 448 64.3h-91.1zm-301.2 32h53.8L224 294.5 338.4 96.3h53.8L224 384.5 55.7 96.3z",
    fill: "#1A202C",
    stroke: "none"
  })
});
const Github = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 496 512",
  className: "css-atdsfb",
  height: "1em",
  width: "1em",
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z",
    stroke: "none"
  })
});
const LinkedIn = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 448 512",
  className: "css-atdsfb",
  height: "1em",
  width: "1em",
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z",
    stroke: "none"
  })
});
const Twitter = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 512 512",
  className: "css-atdsfb",
  height: "1em",
  width: "1em",
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z",
    stroke: "none"
  })
});
const Git = (props) => /* @__PURE__ */ jsx("svg", {
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": 0,
  viewBox: "0 0 32 32",
  height: 25,
  width: 25,
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
  children: /* @__PURE__ */ jsx("path", {
    d: "m26.852 15.281-9.848-9.848a1.453 1.453 0 0 0-2.054 0l-2.045 2.045 2.594 2.594a1.725 1.725 0 0 1 2.185 2.199l2.5 2.5a1.728 1.728 0 1 1-1.035.974l-2.332-2.332v6.136a1.73 1.73 0 1 1-1.421-.05v-6.193a1.729 1.729 0 0 1-.938-2.266l-2.557-2.558-6.753 6.752a1.454 1.454 0 0 0 0 2.055l9.849 9.848a1.453 1.453 0 0 0 2.054 0l9.802-9.802a1.454 1.454 0 0 0 0-2.055z",
    fill: "#1A202C",
    stroke: "none"
  })
});
const Skill = /* @__PURE__ */ componentQrl(inlinedQrl(({ icon, name }) => {
  return /* @__PURE__ */ jsx("div", {
    class: "flex flex-row items-center",
    children: [
      /* @__PURE__ */ jsx("div", {
        class: "flex p-2",
        children: icon
      }),
      /* @__PURE__ */ jsx("div", {
        class: "text-bold text-l",
        children: name
      })
    ]
  });
}, "s_nZuF7LKrYfA"));
const Skills = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "flex flex-col items-center",
    children: [
      /* @__PURE__ */ jsx("h2", {
        class: "text-xl font-bold pb-4 pt-4",
        children: "Skills"
      }),
      /* @__PURE__ */ jsx("div", {
        class: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 rounded-xl w-full",
        children: [
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(Ethereum, {}),
            name: "Solidity"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(Ethereum, {}),
            name: "Web3"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(Ethereum, {}),
            name: "Ethers JS"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(Solana, {}),
            name: "Solana"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(Typescript, {}),
            name: "Typescript"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(Javascript, {}),
            name: "Javascript"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(Vue, {}),
            name: "Vue"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(Nuxt, {}),
            name: "Nuxt"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(React, {}),
            name: "React"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(React, {}),
            name: "React Native"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(Next, {}),
            name: "Next JS"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(Gatsby, {}),
            name: "Gatsby Js"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(NodeJs, {}),
            name: "Node Js"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(Rust, {}),
            name: "Rust"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(HTML5, {}),
            name: "HTML5"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(CSS3, {}),
            name: "CSS3"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(Sass, {}),
            name: "Sass"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(Git, {}),
            name: "Git"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(Docker, {}),
            name: "Docker"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(MongoDB, {}),
            name: "MongoDB"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(MySQL, {}),
            name: "MySQL"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(TeamWork, {}),
            name: "Team working"
          }),
          /* @__PURE__ */ jsx(Skill, {
            icon: /* @__PURE__ */ jsx(ProblemSolving, {}),
            name: "Problem solving"
          })
        ]
      })
    ]
  });
}, "s_CissFoB37os"));
const ProfilePicture = "/build/q-e1824df2.png";
const SocialIcons = {
  LinkedIn,
  Twitter,
  Github
};
const Social = /* @__PURE__ */ componentQrl(inlinedQrl(({ link, type, size }) => {
  const Icon = SocialIcons[type];
  const iconSize = size || 30;
  return /* @__PURE__ */ jsx("a", {
    href: link,
    target: "_blank",
    class: "hover:text-cyan-600 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300",
    children: /* @__PURE__ */ jsx(Icon, {
      width: iconSize,
      height: iconSize
    })
  });
}, "s_jUKScFO4Ol0"));
const Header = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("header", {
    children: /* @__PURE__ */ jsx("section", {
      class: "flex justify-center",
      children: /* @__PURE__ */ jsx("div", {
        class: "flex flex-col lg:flex-row justify-between items-center",
        children: [
          /* @__PURE__ */ jsx("img", {
            class: "w-36 h-36 rounded-xl ring-gray-300 dark:ring-gray-500",
            src: ProfilePicture,
            alt: "Bordered avatar"
          }),
          /* @__PURE__ */ jsx("div", {
            class: "flex flex-col text-center justify-center content-center lg:pl-12 lg:text-left",
            children: [
              /* @__PURE__ */ jsx("div", {
                class: "flex flex-col lg:flex-row",
                children: [
                  /* @__PURE__ */ jsx("h1", {
                    class: "text-3xl font-extrabold sm:text-5xl max-w-1/2",
                    children: "Manuel Tumiati"
                  }),
                  /* @__PURE__ */ jsx("div", {
                    class: "flex flex-row justify-evenly items-center lg:w-1/2",
                    children: [
                      /* @__PURE__ */ jsx(Social, {
                        link: "https://github.com/iltumio",
                        type: "Github"
                      }),
                      /* @__PURE__ */ jsx(Social, {
                        link: "https://www.linkedin.com/in/manuel-tumiati/",
                        type: "LinkedIn"
                      }),
                      /* @__PURE__ */ jsx(Social, {
                        link: "https://twitter.com/iltumio",
                        type: "Twitter"
                      })
                    ]
                  })
                ]
              }),
              /* @__PURE__ */ jsx("h2", {
                class: "text-xl",
                children: /* @__PURE__ */ jsx("strong", {
                  class: "font-extrabold text-red-700 sm:block",
                  children: "Blockchain Engineer"
                })
              }),
              /* @__PURE__ */ jsx("p", {
                class: "mt-4 sm:leading-relaxed sm:text-l",
                children: "I'm a passionate developer from Milan, Italy, interested into everything that moves around software development and blockchain technology"
              })
            ]
          })
        ]
      })
    })
  });
}, "s_ceU05TscGYE"));
const layout = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx(Fragment, {
    children: [
      /* @__PURE__ */ jsx("main", {
        class: "bg-gray-50 min-h-screen flex flex-col justify-center items-center",
        children: /* @__PURE__ */ jsx("div", {
          class: "p-2 lg:p-0 lg:max-w-6xl flex flex-col",
          children: [
            /* @__PURE__ */ jsx(Header, {}),
            /* @__PURE__ */ jsx("section", {
              children: /* @__PURE__ */ jsx(CurrentJobs, {})
            }),
            /* @__PURE__ */ jsx("section", {
              children: /* @__PURE__ */ jsx(Skills, {})
            })
          ]
        })
      }),
      /* @__PURE__ */ jsx("footer", {})
    ]
  });
}, "s_VkLNXphUh5s"));
const Layout_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout
}, Symbol.toStringTag, { value: "Module" }));
const index = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {});
}, "s_xYL1qOwPyDI"));
const description = {
  name: "description",
  content: "Web3 and blockchain engineer from Milan"
};
const head = {
  title: "Manuel Tumiati | Blockchain Engineer",
  meta: [
    description
  ]
};
const Index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index,
  head
}, Symbol.toStringTag, { value: "Module" }));
const Layout = () => Layout_;
const routes = [
  [/^\/$/, [Layout, () => Index], void 0, "/", ["q-94886fdd.js", "q-ca031a9a.js"]]
];
const menus = [];
const trailingSlash = false;
const basePathname = "/";
const cacheModules = true;
const _qwikCityPlan = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  routes,
  menus,
  trailingSlash,
  basePathname,
  cacheModules
}, Symbol.toStringTag, { value: "Module" }));
var HEADERS = Symbol("headers");
var _a;
var HeadersPolyfill = class {
  constructor() {
    this[_a] = {};
  }
  [(_a = HEADERS, Symbol.iterator)]() {
    return this.entries();
  }
  *keys() {
    for (const name of Object.keys(this[HEADERS])) {
      yield name;
    }
  }
  *values() {
    for (const value of Object.values(this[HEADERS])) {
      yield value;
    }
  }
  *entries() {
    for (const name of Object.keys(this[HEADERS])) {
      yield [name, this.get(name)];
    }
  }
  get(name) {
    return this[HEADERS][normalizeHeaderName(name)] || null;
  }
  set(name, value) {
    const normalizedName = normalizeHeaderName(name);
    this[HEADERS][normalizedName] = typeof value !== "string" ? String(value) : value;
  }
  append(name, value) {
    const normalizedName = normalizeHeaderName(name);
    const resolvedValue = this.has(normalizedName) ? `${this.get(normalizedName)}, ${value}` : value;
    this.set(name, resolvedValue);
  }
  delete(name) {
    if (!this.has(name)) {
      return;
    }
    const normalizedName = normalizeHeaderName(name);
    delete this[HEADERS][normalizedName];
  }
  all() {
    return this[HEADERS];
  }
  has(name) {
    return this[HEADERS].hasOwnProperty(normalizeHeaderName(name));
  }
  forEach(callback, thisArg) {
    for (const name in this[HEADERS]) {
      if (this[HEADERS].hasOwnProperty(name)) {
        callback.call(thisArg, this[HEADERS][name], name, this);
      }
    }
  }
};
var HEADERS_INVALID_CHARACTERS = /[^a-z0-9\-#$%&'*+.^_`|~]/i;
function normalizeHeaderName(name) {
  if (typeof name !== "string") {
    name = String(name);
  }
  if (HEADERS_INVALID_CHARACTERS.test(name) || name.trim() === "") {
    throw new TypeError("Invalid character in header field name");
  }
  return name.toLowerCase();
}
function createHeaders() {
  return new (typeof Headers === "function" ? Headers : HeadersPolyfill)();
}
var ErrorResponse = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};
function notFoundHandler(requestCtx) {
  return errorResponse(requestCtx, new ErrorResponse(404, "Not Found"));
}
function errorHandler(requestCtx, e) {
  const status = 500;
  let message = "Server Error";
  let stack = void 0;
  if (e != null) {
    if (typeof e === "object") {
      if (typeof e.message === "string") {
        message = e.message;
      }
      if (e.stack != null) {
        stack = String(e.stack);
      }
    } else {
      message = String(e);
    }
  }
  const html = minimalHtmlResponse(status, message, stack);
  const headers = createHeaders();
  headers.set("Content-Type", "text/html; charset=utf-8");
  return requestCtx.response(
    status,
    headers,
    async (stream) => {
      stream.write(html);
    },
    e
  );
}
function errorResponse(requestCtx, errorResponse2) {
  const html = minimalHtmlResponse(
    errorResponse2.status,
    errorResponse2.message,
    errorResponse2.stack
  );
  const headers = createHeaders();
  headers.set("Content-Type", "text/html; charset=utf-8");
  return requestCtx.response(
    errorResponse2.status,
    headers,
    async (stream) => {
      stream.write(html);
    },
    errorResponse2
  );
}
function minimalHtmlResponse(status, message, stack) {
  const width = typeof message === "string" ? "600px" : "300px";
  const color = status >= 500 ? COLOR_500 : COLOR_400;
  if (status < 500) {
    stack = "";
  }
  return `<!DOCTYPE html>
<html data-qwik-city-status="${status}">
<head>
  <meta charset="utf-8">
  <title>${status} ${message}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body { color: ${color}; background-color: #fafafa; padding: 30px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif; }
    p { max-width: ${width}; margin: 60px auto 30px auto; background: white; border-radius: 4px; box-shadow: 0px 0px 50px -20px ${color}; overflow: hidden; }
    strong { display: inline-block; padding: 15px; background: ${color}; color: white; }
    span { display: inline-block; padding: 15px; }
    pre { max-width: 580px; margin: 0 auto; }
  </style>
</head>
<body>
  <p>
    <strong>${status}</strong>
    <span>${message}</span>
  </p>
  ${stack ? `<pre><code>${stack}</code></pre>` : ``}
</body>
</html>
`;
}
var COLOR_400 = "#006ce9";
var COLOR_500 = "#713fc2";
var MODULE_CACHE$1 = /* @__PURE__ */ new WeakMap();
var loadRoute$1 = async (routes2, menus2, cacheModules2, pathname) => {
  if (Array.isArray(routes2)) {
    for (const route of routes2) {
      const match = route[0].exec(pathname);
      if (match) {
        const loaders = route[1];
        const params = getRouteParams$1(route[2], match);
        const routeBundleNames = route[4];
        const mods = new Array(loaders.length);
        const pendingLoads = [];
        const menuLoader = getMenuLoader$1(menus2, pathname);
        let menu = void 0;
        loaders.forEach((moduleLoader, i) => {
          loadModule$1(
            moduleLoader,
            pendingLoads,
            (routeModule) => mods[i] = routeModule,
            cacheModules2
          );
        });
        loadModule$1(
          menuLoader,
          pendingLoads,
          (menuModule) => menu = menuModule == null ? void 0 : menuModule.default,
          cacheModules2
        );
        if (pendingLoads.length > 0) {
          await Promise.all(pendingLoads);
        }
        return [params, mods, menu, routeBundleNames];
      }
    }
  }
  return null;
};
var loadModule$1 = (moduleLoader, pendingLoads, moduleSetter, cacheModules2) => {
  if (typeof moduleLoader === "function") {
    const loadedModule = MODULE_CACHE$1.get(moduleLoader);
    if (loadedModule) {
      moduleSetter(loadedModule);
    } else {
      const l = moduleLoader();
      if (typeof l.then === "function") {
        pendingLoads.push(
          l.then((loadedModule2) => {
            if (cacheModules2 !== false) {
              MODULE_CACHE$1.set(moduleLoader, loadedModule2);
            }
            moduleSetter(loadedModule2);
          })
        );
      } else if (l) {
        moduleSetter(l);
      }
    }
  }
};
var getMenuLoader$1 = (menus2, pathname) => {
  if (menus2) {
    const menu = menus2.find(
      (m) => m[0] === pathname || pathname.startsWith(m[0] + (pathname.endsWith("/") ? "" : "/"))
    );
    if (menu) {
      return menu[1];
    }
  }
  return void 0;
};
var getRouteParams$1 = (paramNames, match) => {
  const params = {};
  if (paramNames) {
    for (let i = 0; i < paramNames.length; i++) {
      params[paramNames[i]] = match ? match[i + 1] : "";
    }
  }
  return params;
};
var RedirectResponse = class {
  constructor(url, status, headers) {
    this.url = url;
    this.location = url;
    this.status = isRedirectStatus(status) ? status : 307;
    this.headers = headers || createHeaders();
    this.headers.set("Location", this.location);
    this.headers.delete("Cache-Control");
  }
};
function redirectResponse(requestCtx, responseRedirect) {
  return requestCtx.response(responseRedirect.status, responseRedirect.headers, async () => {
  });
}
function isRedirectStatus(status) {
  return typeof status === "number" && status >= 301 && status <= 308;
}
async function loadUserResponse(requestCtx, params, routeModules, platform, trailingSlash2, basePathname2 = "/") {
  if (routeModules.length === 0) {
    throw new ErrorResponse(404, `Not Found`);
  }
  const { request, url } = requestCtx;
  const { pathname } = url;
  const isPageModule = isLastModulePageRoute(routeModules);
  const isPageDataRequest = isPageModule && request.headers.get("Accept") === "application/json";
  const type = isPageDataRequest ? "pagedata" : isPageModule ? "pagehtml" : "endpoint";
  const userResponse = {
    type,
    url,
    params,
    status: 200,
    headers: createHeaders(),
    resolvedBody: void 0,
    pendingBody: void 0,
    aborted: false
  };
  let hasRequestMethodHandler = false;
  if (isPageModule && pathname !== basePathname2) {
    if (trailingSlash2) {
      if (!pathname.endsWith("/")) {
        throw new RedirectResponse(pathname + "/" + url.search, 307);
      }
    } else {
      if (pathname.endsWith("/")) {
        throw new RedirectResponse(
          pathname.slice(0, pathname.length - 1) + url.search,
          307
        );
      }
    }
  }
  let routeModuleIndex = -1;
  const abort = () => {
    routeModuleIndex = ABORT_INDEX;
  };
  const redirect = (url2, status) => {
    return new RedirectResponse(url2, status, userResponse.headers);
  };
  const error = (status, message) => {
    return new ErrorResponse(status, message);
  };
  const next = async () => {
    routeModuleIndex++;
    while (routeModuleIndex < routeModules.length) {
      const endpointModule = routeModules[routeModuleIndex];
      let reqHandler = void 0;
      switch (request.method) {
        case "GET": {
          reqHandler = endpointModule.onGet;
          break;
        }
        case "POST": {
          reqHandler = endpointModule.onPost;
          break;
        }
        case "PUT": {
          reqHandler = endpointModule.onPut;
          break;
        }
        case "PATCH": {
          reqHandler = endpointModule.onPatch;
          break;
        }
        case "OPTIONS": {
          reqHandler = endpointModule.onOptions;
          break;
        }
        case "HEAD": {
          reqHandler = endpointModule.onHead;
          break;
        }
        case "DELETE": {
          reqHandler = endpointModule.onDelete;
          break;
        }
      }
      reqHandler = reqHandler || endpointModule.onRequest;
      if (typeof reqHandler === "function") {
        hasRequestMethodHandler = true;
        const response = {
          get status() {
            return userResponse.status;
          },
          set status(code) {
            userResponse.status = code;
          },
          get headers() {
            return userResponse.headers;
          },
          redirect,
          error
        };
        const requestEv = {
          request,
          url: new URL(url),
          params: { ...params },
          response,
          platform,
          next,
          abort
        };
        const syncData = reqHandler(requestEv);
        if (typeof syncData === "function") {
          userResponse.pendingBody = createPendingBody(syncData);
        } else if (syncData !== null && typeof syncData === "object" && typeof syncData.then === "function") {
          const asyncResolved = await syncData;
          if (typeof asyncResolved === "function") {
            userResponse.pendingBody = createPendingBody(asyncResolved);
          } else {
            userResponse.resolvedBody = asyncResolved;
          }
        } else {
          userResponse.resolvedBody = syncData;
        }
      }
      routeModuleIndex++;
    }
  };
  await next();
  userResponse.aborted = routeModuleIndex >= ABORT_INDEX;
  if (!isPageDataRequest && isRedirectStatus(userResponse.status) && userResponse.headers.has("Location")) {
    throw new RedirectResponse(
      userResponse.headers.get("Location"),
      userResponse.status,
      userResponse.headers
    );
  }
  if (type === "endpoint" && !hasRequestMethodHandler) {
    throw new ErrorResponse(405, `Method Not Allowed`);
  }
  return userResponse;
}
function createPendingBody(cb) {
  return new Promise((resolve, reject) => {
    try {
      const rtn = cb();
      if (rtn !== null && typeof rtn === "object" && typeof rtn.then === "function") {
        rtn.then(resolve, reject);
      } else {
        resolve(rtn);
      }
    } catch (e) {
      reject(e);
    }
  });
}
function isLastModulePageRoute(routeModules) {
  const lastRouteModule = routeModules[routeModules.length - 1];
  return lastRouteModule && typeof lastRouteModule.default === "function";
}
function updateRequestCtx(requestCtx, trailingSlash2) {
  let pathname = requestCtx.url.pathname;
  if (pathname.endsWith(QDATA_JSON)) {
    requestCtx.request.headers.set("Accept", "application/json");
    const trimEnd = pathname.length - QDATA_JSON_LEN + (trailingSlash2 ? 1 : 0);
    pathname = pathname.slice(0, trimEnd);
    if (pathname === "") {
      pathname = "/";
    }
    requestCtx.url.pathname = pathname;
  }
}
var QDATA_JSON = "/q-data.json";
var QDATA_JSON_LEN = QDATA_JSON.length;
var ABORT_INDEX = 999999999;
function endpointHandler(requestCtx, userResponse) {
  const { pendingBody, resolvedBody, status, headers } = userResponse;
  const { response } = requestCtx;
  if (pendingBody === void 0 && resolvedBody === void 0) {
    return response(status, headers, asyncNoop);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  const isJson = headers.get("Content-Type").includes("json");
  return response(status, headers, async ({ write }) => {
    const body = pendingBody !== void 0 ? await pendingBody : resolvedBody;
    if (body !== void 0) {
      if (isJson) {
        write(JSON.stringify(body));
      } else {
        const type = typeof body;
        if (type === "string") {
          write(body);
        } else if (type === "number" || type === "boolean") {
          write(String(body));
        } else {
          write(body);
        }
      }
    }
  });
}
var asyncNoop = async () => {
};
function pageHandler(requestCtx, userResponse, render2, opts, routeBundleNames) {
  const { status, headers } = userResponse;
  const { response } = requestCtx;
  const isPageData = userResponse.type === "pagedata";
  if (isPageData) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  } else if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "text/html; charset=utf-8");
  }
  return response(isPageData ? 200 : status, headers, async (stream) => {
    const result = await render2({
      stream: isPageData ? noopStream : stream,
      envData: getQwikCityEnvData(userResponse),
      ...opts
    });
    if (isPageData) {
      stream.write(JSON.stringify(await getClientPageData(userResponse, result, routeBundleNames)));
    } else {
      if ((typeof result).html === "string") {
        stream.write(result.html);
      }
    }
    if (typeof stream.clientData === "function") {
      stream.clientData(await getClientPageData(userResponse, result, routeBundleNames));
    }
  });
}
async function getClientPageData(userResponse, result, routeBundleNames) {
  const prefetchBundleNames = getPrefetchBundleNames(result, routeBundleNames);
  const clientPage = {
    body: userResponse.pendingBody ? await userResponse.pendingBody : userResponse.resolvedBody,
    status: userResponse.status !== 200 ? userResponse.status : void 0,
    redirect: userResponse.status >= 301 && userResponse.status <= 308 && userResponse.headers.get("location") || void 0,
    prefetch: prefetchBundleNames.length > 0 ? prefetchBundleNames : void 0
  };
  return clientPage;
}
function getPrefetchBundleNames(result, routeBundleNames) {
  const bundleNames = [];
  const addBundle2 = (bundleName) => {
    if (bundleName && !bundleNames.includes(bundleName)) {
      bundleNames.push(bundleName);
    }
  };
  const addPrefetchResource = (prefetchResources) => {
    if (Array.isArray(prefetchResources)) {
      for (const prefetchResource of prefetchResources) {
        const bundleName = prefetchResource.url.split("/").pop();
        if (bundleName && !bundleNames.includes(bundleName)) {
          addBundle2(bundleName);
          addPrefetchResource(prefetchResource.imports);
        }
      }
    }
  };
  addPrefetchResource(result.prefetchResources);
  const manifest2 = result.manifest || result._manifest;
  const renderedSymbols = result._symbols;
  if (manifest2 && renderedSymbols) {
    for (const renderedSymbolName of renderedSymbols) {
      const symbol = manifest2.symbols[renderedSymbolName];
      if (symbol && symbol.ctxName === "component$") {
        addBundle2(manifest2.mapping[renderedSymbolName]);
      }
    }
  }
  if (routeBundleNames) {
    for (const routeBundleName of routeBundleNames) {
      addBundle2(routeBundleName);
    }
  }
  return bundleNames;
}
function getQwikCityEnvData(userResponse) {
  const { url, params, pendingBody, resolvedBody, status } = userResponse;
  return {
    url: url.href,
    qwikcity: {
      params: { ...params },
      response: {
        body: pendingBody || resolvedBody,
        status
      }
    }
  };
}
var noopStream = { write: () => {
} };
async function requestHandler(requestCtx, render2, platform, opts) {
  try {
    updateRequestCtx(requestCtx, trailingSlash);
    const loadedRoute = await loadRoute$1(routes, menus, cacheModules, requestCtx.url.pathname);
    if (loadedRoute) {
      const [params, mods, _, routeBundleNames] = loadedRoute;
      const userResponse = await loadUserResponse(
        requestCtx,
        params,
        mods,
        platform,
        trailingSlash,
        basePathname
      );
      if (userResponse.aborted) {
        return null;
      }
      if (userResponse.type === "endpoint") {
        return endpointHandler(requestCtx, userResponse);
      }
      return pageHandler(requestCtx, userResponse, render2, opts, routeBundleNames);
    }
  } catch (e) {
    if (e instanceof RedirectResponse) {
      return redirectResponse(requestCtx, e);
    }
    if (e instanceof ErrorResponse) {
      return errorResponse(requestCtx, e);
    }
    return errorHandler(requestCtx, e);
  }
  return null;
}
function qwikCity(render2, opts) {
  async function onRequest(request, { next }) {
    try {
      const requestCtx = {
        url: new URL(request.url),
        request,
        response: (status, headers, body) => {
          return new Promise((resolve) => {
            let flushedHeaders = false;
            const { readable, writable } = new TransformStream();
            const writer = writable.getWriter();
            const response = new Response(readable, { status, headers });
            body({
              write: (chunk) => {
                if (!flushedHeaders) {
                  flushedHeaders = true;
                  resolve(response);
                }
                if (typeof chunk === "string") {
                  const encoder = new TextEncoder();
                  writer.write(encoder.encode(chunk));
                } else {
                  writer.write(chunk);
                }
              }
            }).finally(() => {
              if (!flushedHeaders) {
                flushedHeaders = true;
                resolve(response);
              }
              writer.close();
            });
          });
        }
      };
      const handledResponse = await requestHandler(requestCtx, render2, {}, opts);
      if (handledResponse) {
        return handledResponse;
      }
      const nextResponse = await next();
      if (nextResponse.status === 404) {
        const handledResponse2 = await requestHandler(requestCtx, render2, {}, opts);
        if (handledResponse2) {
          return handledResponse2;
        }
        const notFoundResponse = await notFoundHandler(requestCtx);
        return notFoundResponse;
      }
      return nextResponse;
    } catch (e) {
      return new Response(String(e || "Error"), {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  }
  return onRequest;
}
/**
 * @license
 * @builder.io/qwik/server 0.9.0
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
if (typeof global == "undefined") {
  const g = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof self ? self : {};
  g.global = g;
}
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
function createTimer() {
  if (typeof performance === "undefined") {
    return () => 0;
  }
  const start = performance.now();
  return () => {
    const end = performance.now();
    const delta = end - start;
    return delta / 1e6;
  };
}
function getBuildBase(opts) {
  let base = opts.base;
  if (typeof base === "string") {
    if (!base.endsWith("/")) {
      base += "/";
    }
    return base;
  }
  return "/build/";
}
function createPlatform(opts, resolvedManifest) {
  const mapper = resolvedManifest == null ? void 0 : resolvedManifest.mapper;
  const mapperFn = opts.symbolMapper ? opts.symbolMapper : (symbolName) => {
    if (mapper) {
      const hash = getSymbolHash(symbolName);
      const result = mapper[hash];
      if (!result) {
        console.error("Cannot resolve symbol", symbolName, "in", mapper);
      }
      return result;
    }
  };
  const serverPlatform = {
    isServer: true,
    async importSymbol(_element, qrl, symbolName) {
      let [modulePath] = String(qrl).split("#");
      if (!modulePath.endsWith(".js")) {
        modulePath += ".js";
      }
      const module = __require(modulePath);
      if (!(symbolName in module)) {
        throw new Error(`Q-ERROR: missing symbol '${symbolName}' in module '${modulePath}'.`);
      }
      const symbol = module[symbolName];
      return symbol;
    },
    raf: () => {
      console.error("server can not rerender");
      return Promise.resolve();
    },
    nextTick: (fn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn());
        });
      });
    },
    chunkForSymbol(symbolName) {
      return mapperFn(symbolName, mapper);
    }
  };
  return serverPlatform;
}
async function setServerPlatform(opts, manifest2) {
  const platform = createPlatform(opts, manifest2);
  setPlatform(platform);
}
var getSymbolHash = (symbolName) => {
  const index2 = symbolName.lastIndexOf("_");
  if (index2 > -1) {
    return symbolName.slice(index2 + 1);
  }
  return symbolName;
};
var QWIK_LOADER_DEFAULT_MINIFIED = '(()=>{function e(e){return"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag]}((t,n)=>{const o="__q_context__",r=window,a=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\\\:"+n+"]").forEach((t=>l(t,e,n,o)))},i=(e,t)=>new CustomEvent(e,{detail:t}),s=e=>{throw Error("QWIK "+e)},c=(e,n)=>(e=e.closest("[q\\\\:container]"),new URL(n,new URL(e?e.getAttribute("q:base"):t.baseURI,t.baseURI))),l=async(n,a,l,d)=>{var u;n.hasAttribute("preventdefault:"+l)&&d.preventDefault();const b="on"+a+":"+l,v=null==(u=n._qc_)?void 0:u.li[b];if(v){for(const e of v)await e.getFn([n,d],(()=>n.isConnected))(d,n);return}const p=n.getAttribute(b);if(p)for(const a of p.split("\\n")){const l=c(n,a);if(l){const a=f(l),c=(r[l.pathname]||(w=await import(l.href.split("#")[0]),Object.values(w).find(e)||w))[a]||s(l+" does not export "+a),u=t[o];if(n.isConnected)try{t[o]=[n,d,l],await c(d,n)}finally{t[o]=u,t.dispatchEvent(i("qsymbol",{symbol:a,element:n}))}}}var w},f=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",d=async e=>{let t=e.target;for(a("-document",e.type,e);t&&t.getAttribute;)await l(t,"",e.type,e),t=e.bubbles&&!0!==e.cancelBubble?t.parentElement:null},u=e=>{a("-window",e.type,e)},b=()=>{const e=t.readyState;if(!n&&("interactive"==e||"complete"==e)){n=1,a("","qinit",i("qinit"));const e=t.querySelectorAll("[on\\\\:qvisible]");if(e.length>0){const t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n.target),l(n.target,"","qvisible",i("qvisible",n)))}));e.forEach((e=>t.observe(e)))}}},v=new Set,p=e=>{for(const t of e)v.has(t)||(document.addEventListener(t,d,{capture:!0}),r.addEventListener(t,u),v.add(t))};if(!t.qR){const e=r.qwikevents;Array.isArray(e)&&p(e),r.qwikevents={push:(...e)=>p(e)},t.addEventListener("readystatechange",b),b()}})(document)})();';
var QWIK_LOADER_DEFAULT_DEBUG = '(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized) => {\n        const win = window;\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n            doc.querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, type, ev)));\n        };\n        const createEvent = (eventName, detail) => new CustomEvent(eventName, {\n            detail: detail\n        });\n        const error = msg => {\n            throw new Error("QWIK " + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element ? element.getAttribute("q:base") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, eventName, ev) => {\n            var _a;\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const attrName = "on" + onPrefix + ":" + eventName;\n            const qrls = null == (_a = element._qc_) ? void 0 : _a.li[attrName];\n            if (qrls) {\n                for (const q of qrls) {\n                    await q.getFn([ element, ev ], (() => element.isConnected))(ev, element);\n                }\n                return;\n            }\n            const attrValue = element.getAttribute(attrName);\n            if (attrValue) {\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = qrlResolver(element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (win[url.pathname] || findModule(await import(url.href.split("#")[0])))[symbolName] || error(url + " does not export " + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        if (element.isConnected) {\n                            try {\n                                doc.__q_context__ = [ element, ev, url ];\n                                await handler(ev, element);\n                            } finally {\n                                doc.__q_context__ = previousCtx;\n                                doc.dispatchEvent(createEvent("qsymbol", {\n                                    symbol: symbolName,\n                                    element: element\n                                }));\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const processDocumentEvent = async ev => {\n            let element = ev.target;\n            broadcast("-document", ev.type, ev);\n            while (element && element.getAttribute) {\n                await dispatch(element, "", ev.type, ev);\n                element = ev.bubbles && !0 !== ev.cancelBubble ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast("-window", ev.type, ev);\n        };\n        const processReadyStateChange = () => {\n            const readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                broadcast("", "qinit", createEvent("qinit"));\n                const results = doc.querySelectorAll("[on\\\\:qvisible]");\n                if (results.length > 0) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", "qvisible", createEvent("qvisible", entry));\n                            }\n                        }\n                    }));\n                    results.forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const events =  new Set;\n        const push = eventNames => {\n            for (const eventName of eventNames) {\n                if (!events.has(eventName)) {\n                    document.addEventListener(eventName, processDocumentEvent, {\n                        capture: !0\n                    });\n                    win.addEventListener(eventName, processWindowEvent);\n                    events.add(eventName);\n                }\n            }\n        };\n        if (!doc.qR) {\n            const qwikevents = win.qwikevents;\n            Array.isArray(qwikevents) && push(qwikevents);\n            win.qwikevents = {\n                push: (...e) => push(e)\n            };\n            doc.addEventListener("readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
var QWIK_LOADER_OPTIMIZE_MINIFIED = '(()=>{function e(e){return"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag]}((t,n)=>{const o="__q_context__",r=window,a=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\\\:"+n+"]").forEach((t=>l(t,e,n,o)))},i=(e,t)=>new CustomEvent(e,{detail:t}),s=e=>{throw Error("QWIK "+e)},c=(e,n)=>(e=e.closest("[q\\\\:container]"),new URL(n,new URL(e?e.getAttribute("q:base"):t.baseURI,t.baseURI))),l=async(n,a,l,d)=>{var u;n.hasAttribute("preventdefault:"+l)&&d.preventDefault();const b="on"+a+":"+l,v=null==(u=n._qc_)?void 0:u.li[b];if(v){for(const e of v)await e.getFn([n,d],(()=>n.isConnected))(d,n);return}const p=n.getAttribute(b);if(p)for(const a of p.split("\\n")){const l=c(n,a);if(l){const a=f(l),c=(r[l.pathname]||(w=await import(l.href.split("#")[0]),Object.values(w).find(e)||w))[a]||s(l+" does not export "+a),u=t[o];if(n.isConnected)try{t[o]=[n,d,l],await c(d,n)}finally{t[o]=u,t.dispatchEvent(i("qsymbol",{symbol:a,element:n}))}}}var w},f=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",d=async e=>{let t=e.target;for(a("-document",e.type,e);t&&t.getAttribute;)await l(t,"",e.type,e),t=e.bubbles&&!0!==e.cancelBubble?t.parentElement:null},u=e=>{a("-window",e.type,e)},b=()=>{const e=t.readyState;if(!n&&("interactive"==e||"complete"==e)){n=1,a("","qinit",i("qinit"));const e=t.querySelectorAll("[on\\\\:qvisible]");if(e.length>0){const t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n.target),l(n.target,"","qvisible",i("qvisible",n)))}));e.forEach((e=>t.observe(e)))}}},v=new Set,p=e=>{for(const t of e)v.has(t)||(document.addEventListener(t,d,{capture:!0}),r.addEventListener(t,u),v.add(t))};if(!t.qR){const e=r.qwikevents;Array.isArray(e)&&p(e),r.qwikevents={push:(...e)=>p(e)},t.addEventListener("readystatechange",b),b()}})(document)})();';
var QWIK_LOADER_OPTIMIZE_DEBUG = '(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized) => {\n        const win = window;\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n            doc.querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, type, ev)));\n        };\n        const createEvent = (eventName, detail) => new CustomEvent(eventName, {\n            detail: detail\n        });\n        const error = msg => {\n            throw new Error("QWIK " + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element ? element.getAttribute("q:base") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, eventName, ev) => {\n            var _a;\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const attrName = "on" + onPrefix + ":" + eventName;\n            const qrls = null == (_a = element._qc_) ? void 0 : _a.li[attrName];\n            if (qrls) {\n                for (const q of qrls) {\n                    await q.getFn([ element, ev ], (() => element.isConnected))(ev, element);\n                }\n                return;\n            }\n            const attrValue = element.getAttribute(attrName);\n            if (attrValue) {\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = qrlResolver(element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (win[url.pathname] || findModule(await import(url.href.split("#")[0])))[symbolName] || error(url + " does not export " + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        if (element.isConnected) {\n                            try {\n                                doc.__q_context__ = [ element, ev, url ];\n                                await handler(ev, element);\n                            } finally {\n                                doc.__q_context__ = previousCtx;\n                                doc.dispatchEvent(createEvent("qsymbol", {\n                                    symbol: symbolName,\n                                    element: element\n                                }));\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const processDocumentEvent = async ev => {\n            let element = ev.target;\n            broadcast("-document", ev.type, ev);\n            while (element && element.getAttribute) {\n                await dispatch(element, "", ev.type, ev);\n                element = ev.bubbles && !0 !== ev.cancelBubble ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast("-window", ev.type, ev);\n        };\n        const processReadyStateChange = () => {\n            const readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                broadcast("", "qinit", createEvent("qinit"));\n                const results = doc.querySelectorAll("[on\\\\:qvisible]");\n                if (results.length > 0) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", "qvisible", createEvent("qvisible", entry));\n                            }\n                        }\n                    }));\n                    results.forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const events = new Set;\n        const push = eventNames => {\n            for (const eventName of eventNames) {\n                if (!events.has(eventName)) {\n                    document.addEventListener(eventName, processDocumentEvent, {\n                        capture: !0\n                    });\n                    win.addEventListener(eventName, processWindowEvent);\n                    events.add(eventName);\n                }\n            }\n        };\n        if (!doc.qR) {\n            const qwikevents = win.qwikevents;\n            Array.isArray(qwikevents) && push(qwikevents);\n            win.qwikevents = {\n                push: (...e) => push(e)\n            };\n            doc.addEventListener("readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
function getQwikLoaderScript(opts = {}) {
  if (Array.isArray(opts.events) && opts.events.length > 0) {
    const loader = opts.debug ? QWIK_LOADER_OPTIMIZE_DEBUG : QWIK_LOADER_OPTIMIZE_MINIFIED;
    return loader.replace("window.qEvents", JSON.stringify(opts.events));
  }
  return opts.debug ? QWIK_LOADER_DEFAULT_DEBUG : QWIK_LOADER_DEFAULT_MINIFIED;
}
function getPrefetchResources(snapshotResult, opts, resolvedManifest) {
  if (!resolvedManifest) {
    return [];
  }
  const prefetchStrategy = opts.prefetchStrategy;
  const buildBase = getBuildBase(opts);
  if (prefetchStrategy !== null) {
    if (!prefetchStrategy || !prefetchStrategy.symbolsToPrefetch || prefetchStrategy.symbolsToPrefetch === "auto") {
      return getAutoPrefetch(snapshotResult, resolvedManifest, buildBase);
    }
    if (typeof prefetchStrategy.symbolsToPrefetch === "function") {
      try {
        return prefetchStrategy.symbolsToPrefetch({ manifest: resolvedManifest.manifest });
      } catch (e) {
        console.error("getPrefetchUrls, symbolsToPrefetch()", e);
      }
    }
  }
  return [];
}
function getAutoPrefetch(snapshotResult, resolvedManifest, buildBase) {
  const prefetchResources = [];
  const listeners = snapshotResult == null ? void 0 : snapshotResult.listeners;
  const stateObjs = snapshotResult == null ? void 0 : snapshotResult.objs;
  const { mapper, manifest: manifest2 } = resolvedManifest;
  const urls = /* @__PURE__ */ new Set();
  if (Array.isArray(listeners)) {
    for (const prioritizedSymbolName in mapper) {
      const hasSymbol = listeners.some((l) => {
        return l.qrl.getHash() === prioritizedSymbolName;
      });
      if (hasSymbol) {
        addBundle(manifest2, urls, prefetchResources, buildBase, mapper[prioritizedSymbolName][1]);
      }
    }
  }
  if (Array.isArray(stateObjs)) {
    for (const obj of stateObjs) {
      if (isQrl(obj)) {
        const qrlSymbolName = obj.getHash();
        const resolvedSymbol = mapper[qrlSymbolName];
        if (resolvedSymbol) {
          addBundle(manifest2, urls, prefetchResources, buildBase, resolvedSymbol[0]);
        }
      }
    }
  }
  return prefetchResources;
}
function addBundle(manifest2, urls, prefetchResources, buildBase, bundleFileName) {
  const url = buildBase + bundleFileName;
  if (!urls.has(url)) {
    urls.add(url);
    const bundle = manifest2.bundles[bundleFileName];
    if (bundle) {
      const prefetchResource = {
        url,
        imports: []
      };
      prefetchResources.push(prefetchResource);
      if (Array.isArray(bundle.imports)) {
        for (const importedFilename of bundle.imports) {
          addBundle(manifest2, urls, prefetchResource.imports, buildBase, importedFilename);
        }
      }
    }
  }
}
var isQrl = (value) => {
  return typeof value === "function" && typeof value.getSymbol === "function";
};
var qDev = globalThis.qDev === true;
var EMPTY_ARRAY = [];
var EMPTY_OBJ = {};
if (qDev) {
  Object.freeze(EMPTY_ARRAY);
  Object.freeze(EMPTY_OBJ);
  Error.stackTraceLimit = 9999;
}
[
  "click",
  "dblclick",
  "contextmenu",
  "auxclick",
  "pointerdown",
  "pointerup",
  "pointermove",
  "pointerover",
  "pointerenter",
  "pointerleave",
  "pointerout",
  "pointercancel",
  "gotpointercapture",
  "lostpointercapture",
  "touchstart",
  "touchend",
  "touchmove",
  "touchcancel",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "wheel",
  "gesturestart",
  "gesturechange",
  "gestureend",
  "keydown",
  "keyup",
  "keypress",
  "input",
  "change",
  "search",
  "invalid",
  "beforeinput",
  "select",
  "focusin",
  "focusout",
  "focus",
  "blur",
  "submit",
  "reset",
  "scroll"
].map((n) => `on${n.toLowerCase()}$`);
[
  "useWatch$",
  "useClientEffect$",
  "useEffect$",
  "component$",
  "useStyles$",
  "useStylesScoped$"
].map((n) => n.toLowerCase());
function getValidManifest(manifest2) {
  if (manifest2 != null && manifest2.mapping != null && typeof manifest2.mapping === "object" && manifest2.symbols != null && typeof manifest2.symbols === "object" && manifest2.bundles != null && typeof manifest2.bundles === "object") {
    return manifest2;
  }
  return void 0;
}
function workerFetchScript() {
  const fetch2 = `Promise.all(e.data.map(u=>fetch(u))).finally(()=>{setTimeout(postMessage({}),9999)})`;
  const workerBody = `onmessage=(e)=>{${fetch2}}`;
  const blob = `new Blob(['${workerBody}'],{type:"text/javascript"})`;
  const url = `URL.createObjectURL(${blob})`;
  let s = `const w=new Worker(${url});`;
  s += `w.postMessage(u.map(u=>new URL(u,origin)+''));`;
  s += `w.onmessage=()=>{w.terminate()};`;
  return s;
}
function prefetchUrlsEventScript(prefetchResources) {
  const data = {
    bundles: flattenPrefetchResources(prefetchResources).map((u) => u.split("/").pop())
  };
  return `dispatchEvent(new CustomEvent("qprefetch",{detail:${JSON.stringify(data)}}))`;
}
function flattenPrefetchResources(prefetchResources) {
  const urls = [];
  const addPrefetchResource = (prefetchResources2) => {
    if (Array.isArray(prefetchResources2)) {
      for (const prefetchResource of prefetchResources2) {
        if (!urls.includes(prefetchResource.url)) {
          urls.push(prefetchResource.url);
          addPrefetchResource(prefetchResource.imports);
        }
      }
    }
  };
  addPrefetchResource(prefetchResources);
  return urls;
}
function applyPrefetchImplementation(opts, prefetchResources) {
  const { prefetchStrategy } = opts;
  if (prefetchStrategy !== null) {
    const prefetchImpl = normalizePrefetchImplementation(prefetchStrategy == null ? void 0 : prefetchStrategy.implementation);
    const prefetchNodes = [];
    if (prefetchImpl.prefetchEvent === "always") {
      prefetchUrlsEvent(prefetchNodes, prefetchResources);
    }
    if (prefetchImpl.linkInsert === "html-append") {
      linkHtmlImplementation(prefetchNodes, prefetchResources, prefetchImpl);
    }
    if (prefetchImpl.linkInsert === "js-append") {
      linkJsImplementation(prefetchNodes, prefetchResources, prefetchImpl);
    } else if (prefetchImpl.workerFetchInsert === "always") {
      workerFetchImplementation(prefetchNodes, prefetchResources);
    }
    if (prefetchNodes.length > 0) {
      return jsx(Fragment, { children: prefetchNodes });
    }
  }
  return null;
}
function prefetchUrlsEvent(prefetchNodes, prefetchResources) {
  prefetchNodes.push(
    jsx("script", {
      type: "module",
      dangerouslySetInnerHTML: prefetchUrlsEventScript(prefetchResources)
    })
  );
}
function linkHtmlImplementation(prefetchNodes, prefetchResources, prefetchImpl) {
  const urls = flattenPrefetchResources(prefetchResources);
  const rel = prefetchImpl.linkRel || "prefetch";
  for (const url of urls) {
    const attributes = {};
    attributes["href"] = url;
    attributes["rel"] = rel;
    if (rel === "prefetch" || rel === "preload") {
      if (url.endsWith(".js")) {
        attributes["as"] = "script";
      }
    }
    prefetchNodes.push(jsx("link", attributes, void 0));
  }
}
function linkJsImplementation(prefetchNodes, prefetchResources, prefetchImpl) {
  const rel = prefetchImpl.linkRel || "prefetch";
  let s = ``;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `let supportsLinkRel = true;`;
  }
  s += `const u=${JSON.stringify(flattenPrefetchResources(prefetchResources))};`;
  s += `u.map((u,i)=>{`;
  s += `const l=document.createElement('link');`;
  s += `l.setAttribute("href",u);`;
  s += `l.setAttribute("rel","${rel}");`;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `if(i===0){`;
    s += `try{`;
    s += `supportsLinkRel=l.relList.supports("${rel}");`;
    s += `}catch(e){}`;
    s += `}`;
  }
  s += `document.body.appendChild(l);`;
  s += `});`;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `if(!supportsLinkRel){`;
    s += workerFetchScript();
    s += `}`;
  }
  if (prefetchImpl.workerFetchInsert === "always") {
    s += workerFetchScript();
  }
  prefetchNodes.push(
    jsx("script", {
      type: "module",
      dangerouslySetInnerHTML: s
    })
  );
}
function workerFetchImplementation(prefetchNodes, prefetchResources) {
  let s = `const u=${JSON.stringify(flattenPrefetchResources(prefetchResources))};`;
  s += workerFetchScript();
  prefetchNodes.push(
    jsx("script", {
      type: "module",
      dangerouslySetInnerHTML: s
    })
  );
}
function normalizePrefetchImplementation(input) {
  if (typeof input === "string") {
    switch (input) {
      case "link-prefetch-html": {
        return {
          linkInsert: "html-append",
          linkRel: "prefetch",
          workerFetchInsert: null,
          prefetchEvent: null
        };
      }
      case "link-prefetch": {
        return {
          linkInsert: "js-append",
          linkRel: "prefetch",
          workerFetchInsert: "no-link-support",
          prefetchEvent: null
        };
      }
      case "link-preload-html": {
        return {
          linkInsert: "html-append",
          linkRel: "preload",
          workerFetchInsert: null,
          prefetchEvent: null
        };
      }
      case "link-preload": {
        return {
          linkInsert: "js-append",
          linkRel: "preload",
          workerFetchInsert: "no-link-support",
          prefetchEvent: null
        };
      }
      case "link-modulepreload-html": {
        return {
          linkInsert: "html-append",
          linkRel: "modulepreload",
          workerFetchInsert: null,
          prefetchEvent: null
        };
      }
      case "link-modulepreload": {
        return {
          linkInsert: "js-append",
          linkRel: "modulepreload",
          workerFetchInsert: "no-link-support",
          prefetchEvent: null
        };
      }
    }
    return {
      linkInsert: null,
      linkRel: null,
      workerFetchInsert: "always",
      prefetchEvent: null
    };
  }
  if (input && typeof input === "object") {
    return input;
  }
  const defaultImplementation = {
    linkInsert: null,
    linkRel: null,
    workerFetchInsert: "always",
    prefetchEvent: null
  };
  return defaultImplementation;
}
var DOCTYPE = "<!DOCTYPE html>";
async function renderToStream(rootNode, opts) {
  var _a2, _b, _c, _d, _e, _f;
  let stream = opts.stream;
  let bufferSize = 0;
  let totalSize = 0;
  let networkFlushes = 0;
  let firstFlushTime = 0;
  const inOrderStreaming = (_b = (_a2 = opts.streaming) == null ? void 0 : _a2.inOrder) != null ? _b : {
    strategy: "auto",
    maximunInitialChunk: 5e4,
    maximunChunk: 3e4
  };
  const containerTagName = (_c = opts.containerTagName) != null ? _c : "html";
  const containerAttributes = (_d = opts.containerAttributes) != null ? _d : {};
  let buffer = "";
  const nativeStream = stream;
  const firstFlushTimer = createTimer();
  function flush() {
    if (buffer) {
      nativeStream.write(buffer);
      buffer = "";
      bufferSize = 0;
      networkFlushes++;
      if (networkFlushes === 1) {
        firstFlushTime = firstFlushTimer();
      }
    }
  }
  function enqueue(chunk) {
    bufferSize += chunk.length;
    totalSize += chunk.length;
    buffer += chunk;
  }
  switch (inOrderStreaming.strategy) {
    case "disabled":
      stream = {
        write: enqueue
      };
      break;
    case "direct":
      stream = nativeStream;
      break;
    case "auto":
      let count = 0;
      let forceFlush = false;
      const minimunChunkSize = (_e = inOrderStreaming.maximunChunk) != null ? _e : 0;
      const initialChunkSize = (_f = inOrderStreaming.maximunInitialChunk) != null ? _f : 0;
      stream = {
        write(chunk) {
          if (chunk === "<!--qkssr-f-->") {
            forceFlush || (forceFlush = true);
          } else if (chunk === "<!--qkssr-pu-->") {
            count++;
          } else if (chunk === "<!--qkssr-po-->") {
            count--;
          } else {
            enqueue(chunk);
          }
          const chunkSize = networkFlushes === 0 ? initialChunkSize : minimunChunkSize;
          if (count === 0 && (forceFlush || bufferSize >= chunkSize)) {
            forceFlush = false;
            flush();
          }
        }
      };
      break;
  }
  if (containerTagName === "html") {
    stream.write(DOCTYPE);
  } else {
    if (opts.qwikLoader) {
      if (opts.qwikLoader.include === void 0) {
        opts.qwikLoader.include = "never";
      }
      if (opts.qwikLoader.position === void 0) {
        opts.qwikLoader.position = "bottom";
      }
    } else {
      opts.qwikLoader = {
        include: "never"
      };
    }
  }
  if (!opts.manifest) {
    console.warn("Missing client manifest, loading symbols in the client might 404");
  }
  const buildBase = getBuildBase(opts);
  const resolvedManifest = resolveManifest(opts.manifest);
  await setServerPlatform(opts, resolvedManifest);
  let prefetchResources = [];
  let snapshotResult = null;
  const injections = resolvedManifest == null ? void 0 : resolvedManifest.manifest.injections;
  const beforeContent = injections ? injections.map((injection) => {
    var _a3;
    return jsx(injection.tag, (_a3 = injection.attributes) != null ? _a3 : EMPTY_OBJ);
  }) : void 0;
  const renderTimer = createTimer();
  const renderSymbols = [];
  let renderTime = 0;
  let snapshotTime = 0;
  await renderSSR(rootNode, {
    stream,
    containerTagName,
    containerAttributes,
    envData: opts.envData,
    base: buildBase,
    beforeContent,
    beforeClose: async (contexts, containerState) => {
      var _a3, _b2, _c2;
      renderTime = renderTimer();
      const snapshotTimer = createTimer();
      snapshotResult = await _pauseFromContexts(contexts, containerState);
      prefetchResources = getPrefetchResources(snapshotResult, opts, resolvedManifest);
      const jsonData = JSON.stringify(snapshotResult.state, void 0, qDev ? "  " : void 0);
      const children = [
        jsx("script", {
          type: "qwik/json",
          dangerouslySetInnerHTML: escapeText(jsonData)
        })
      ];
      if (prefetchResources.length > 0) {
        children.push(applyPrefetchImplementation(opts, prefetchResources));
      }
      const needLoader = !snapshotResult || snapshotResult.mode !== "static";
      const includeMode = (_b2 = (_a3 = opts.qwikLoader) == null ? void 0 : _a3.include) != null ? _b2 : "auto";
      const includeLoader = includeMode === "always" || includeMode === "auto" && needLoader;
      if (includeLoader) {
        const qwikLoaderScript = getQwikLoaderScript({
          events: (_c2 = opts.qwikLoader) == null ? void 0 : _c2.events,
          debug: opts.debug
        });
        children.push(
          jsx("script", {
            id: "qwikloader",
            dangerouslySetInnerHTML: qwikLoaderScript
          })
        );
      }
      const uniqueListeners = /* @__PURE__ */ new Set();
      snapshotResult.listeners.forEach((li) => {
        uniqueListeners.add(JSON.stringify(li.eventName));
      });
      const extraListeners = Array.from(uniqueListeners);
      if (extraListeners.length > 0) {
        let content = `window.qwikevents.push(${extraListeners.join(", ")})`;
        if (!includeLoader) {
          content = `window.qwikevents||=[];${content}`;
        }
        children.push(
          jsx("script", {
            dangerouslySetInnerHTML: content
          })
        );
      }
      collectRenderSymbols(renderSymbols, contexts);
      snapshotTime = snapshotTimer();
      return jsx(Fragment, { children });
    }
  });
  flush();
  const result = {
    prefetchResources: void 0,
    snapshotResult,
    flushes: networkFlushes,
    manifest: resolvedManifest == null ? void 0 : resolvedManifest.manifest,
    size: totalSize,
    timing: {
      render: renderTime,
      snapshot: snapshotTime,
      firstFlush: firstFlushTime
    },
    _symbols: renderSymbols
  };
  return result;
}
function resolveManifest(manifest2) {
  if (!manifest2) {
    return void 0;
  }
  if ("mapper" in manifest2) {
    return manifest2;
  }
  manifest2 = getValidManifest(manifest2);
  if (manifest2) {
    const mapper = {};
    Object.entries(manifest2.mapping).forEach(([key, value]) => {
      mapper[getSymbolHash(key)] = [key, value];
    });
    return {
      mapper,
      manifest: manifest2
    };
  }
  return void 0;
}
var escapeText = (str) => {
  return str.replace(/<(\/?script)/g, "\\x3C$1");
};
function collectRenderSymbols(renderSymbols, elements) {
  var _a2;
  for (const ctx of elements) {
    const symbol = (_a2 = ctx.$renderQrl$) == null ? void 0 : _a2.getSymbol();
    if (symbol && !renderSymbols.includes(symbol)) {
      renderSymbols.push(symbol);
    }
  }
}
const manifest = { "symbols": { "s_hA9UPaY8sNQ": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onClick", "canonicalFilename": "s_ha9upay8snq", "hash": "hA9UPaY8sNQ", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_mYsiJcA4IBc" }, "s_skxgNVWVOT8": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onMouseOver", "canonicalFilename": "s_skxgnvwvot8", "hash": "skxgNVWVOT8", "ctxKind": "event", "ctxName": "onMouseOver$", "captures": false, "parent": "s_mYsiJcA4IBc" }, "s_uVE5iM9H73c": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onQVisible", "canonicalFilename": "s_uve5im9h73c", "hash": "uVE5iM9H73c", "ctxKind": "event", "ctxName": "onQVisible$", "captures": false, "parent": "s_mYsiJcA4IBc" }, "s_AaAlzKH0KlQ": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "QwikCity_component_useWatch", "canonicalFilename": "s_aaalzkh0klq", "hash": "AaAlzKH0KlQ", "ctxKind": "function", "ctxName": "useWatch$", "captures": true, "parent": "s_z1nvHyEppoI" }, "s_3nmkaWu7nDY": { "origin": "components/jobPosition/jobPosition.tsx", "displayName": "jobPosition_component", "canonicalFilename": "s_3nmkawu7ndy", "hash": "3nmkaWu7nDY", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_3sccYCDd1Z0": { "origin": "root.tsx", "displayName": "root_component", "canonicalFilename": "s_3sccycdd1z0", "hash": "3sccYCDd1Z0", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_CissFoB37os": { "origin": "components/skills/skills.tsx", "displayName": "skills_component", "canonicalFilename": "s_cissfob37os", "hash": "CissFoB37os", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_VkLNXphUh5s": { "origin": "routes/layout.tsx", "displayName": "layout_component", "canonicalFilename": "s_vklnxphuh5s", "hash": "VkLNXphUh5s", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_ceU05TscGYE": { "origin": "components/header/header.tsx", "displayName": "header_component", "canonicalFilename": "s_ceu05tscgye", "hash": "ceU05TscGYE", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_iJSF1Tq5LZs": { "origin": "components/currentJobs/currentJobs.tsx", "displayName": "currentJobs_component", "canonicalFilename": "s_ijsf1tq5lzs", "hash": "iJSF1Tq5LZs", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_jUKScFO4Ol0": { "origin": "components/social/social.tsx", "displayName": "social_component", "canonicalFilename": "s_jukscfo4ol0", "hash": "jUKScFO4Ol0", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_mYsiJcA4IBc": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component", "canonicalFilename": "s_mysijca4ibc", "hash": "mYsiJcA4IBc", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_nZuF7LKrYfA": { "origin": "components/skill/skill.tsx", "displayName": "skill_component", "canonicalFilename": "s_nzuf7lkryfa", "hash": "nZuF7LKrYfA", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_nd8yk3KO22c": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "RouterOutlet_component", "canonicalFilename": "s_nd8yk3ko22c", "hash": "nd8yk3KO22c", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_xYL1qOwPyDI": { "origin": "routes/index.tsx", "displayName": "routes_component", "canonicalFilename": "s_xyl1qowpydi", "hash": "xYL1qOwPyDI", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_z1nvHyEppoI": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "QwikCity_component", "canonicalFilename": "s_z1nvhyeppoi", "hash": "z1nvHyEppoI", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_zrbrqoaqXSY": { "origin": "components/router-head/router-head.tsx", "displayName": "RouterHead_component", "canonicalFilename": "s_zrbrqoaqxsy", "hash": "zrbrqoaqXSY", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null } }, "mapping": { "s_hA9UPaY8sNQ": "q-64781bbe.js", "s_skxgNVWVOT8": "q-64781bbe.js", "s_uVE5iM9H73c": "q-64781bbe.js", "s_AaAlzKH0KlQ": "q-8682d256.js", "s_3nmkaWu7nDY": "q-83db7898.js", "s_3sccYCDd1Z0": "q-37c44283.js", "s_CissFoB37os": "q-3a047c37.js", "s_VkLNXphUh5s": "q-8985cbc8.js", "s_ceU05TscGYE": "q-2a9a7b07.js", "s_iJSF1Tq5LZs": "q-8657cca8.js", "s_jUKScFO4Ol0": "q-26123b9c.js", "s_mYsiJcA4IBc": "q-64781bbe.js", "s_nZuF7LKrYfA": "q-a4b51c9b.js", "s_nd8yk3KO22c": "q-587cdc4e.js", "s_xYL1qOwPyDI": "q-5832a244.js", "s_z1nvHyEppoI": "q-8682d256.js", "s_zrbrqoaqXSY": "q-de4c390e.js" }, "bundles": { "q-0db42049.js": { "size": 346, "imports": ["q-27c4ce8c.js"], "dynamicImports": ["q-7b18effb.js", "q-94886fdd.js", "q-ca031a9a.js"], "origins": ["@qwik-city-plan"] }, "q-143c7194.js": { "size": 2180, "origins": ["node_modules/@builder.io/qwik-city/service-worker.mjs", "src/routes/service-worker.js"] }, "q-26123b9c.js": { "size": 330, "imports": ["q-27c4ce8c.js", "q-2a9a7b07.js"], "origins": ["src/entry_social.js", "src/s_jukscfo4ol0.js"], "symbols": ["s_jUKScFO4Ol0"] }, "q-27c4ce8c.js": { "size": 33229, "dynamicImports": ["q-37c44283.js"], "origins": ["\0vite/preload-helper", "node_modules/@builder.io/qwik/core.min.mjs", "src/global.css", "src/root.js"] }, "q-2a9a7b07.js": { "size": 4642, "imports": ["q-27c4ce8c.js"], "dynamicImports": ["q-26123b9c.js"], "origins": ["src/components/icons/Github.js", "src/components/icons/LinkedIn.js", "src/components/icons/Twitter.js", "src/components/social/social.js", "src/entry_header.js", "src/images/ProfilePicture.png", "src/s_ceu05tscgye.js"], "symbols": ["s_ceU05TscGYE"] }, "q-37c44283.js": { "size": 4421, "imports": ["q-27c4ce8c.js"], "dynamicImports": ["q-0db42049.js", "q-587cdc4e.js", "q-64781bbe.js", "q-8682d256.js", "q-de4c390e.js"], "origins": ["node_modules/@builder.io/qwik-city/index.qwik.mjs", "src/components/router-head/router-head.js", "src/entry_root.js", "src/s_3sccycdd1z0.js"], "symbols": ["s_3sccYCDd1Z0"] }, "q-3a047c37.js": { "size": 25075, "imports": ["q-27c4ce8c.js"], "dynamicImports": ["q-a4b51c9b.js"], "origins": ["src/components/icons/CSS3.js", "src/components/icons/Docker.js", "src/components/icons/Ethereum.js", "src/components/icons/Gatsby.js", "src/components/icons/Git.js", "src/components/icons/HTML5.js", "src/components/icons/Javascript.js", "src/components/icons/MongoDB.js", "src/components/icons/MySQL.js", "src/components/icons/Next.js", "src/components/icons/NodeJs.js", "src/components/icons/Nuxt.js", "src/components/icons/ProblemSolving.js", "src/components/icons/React.js", "src/components/icons/Rust.js", "src/components/icons/Sass.js", "src/components/icons/Solana.js", "src/components/icons/TeamWork.js", "src/components/icons/Typescript.js", "src/components/icons/Vue.js", "src/components/skill/skill.js", "src/entry_skills.js", "src/s_cissfob37os.js"], "symbols": ["s_CissFoB37os"] }, "q-5832a244.js": { "size": 88, "imports": ["q-27c4ce8c.js"], "origins": ["src/entry_routes.js", "src/s_xyl1qowpydi.js"], "symbols": ["s_xYL1qOwPyDI"] }, "q-587cdc4e.js": { "size": 269, "imports": ["q-27c4ce8c.js", "q-37c44283.js"], "origins": ["src/entry_RouterOutlet.js", "src/s_nd8yk3ko22c.js"], "symbols": ["s_nd8yk3KO22c"] }, "q-64781bbe.js": { "size": 886, "imports": ["q-27c4ce8c.js", "q-37c44283.js"], "origins": ["src/entry_Link.js", "src/s_ha9upay8snq.js", "src/s_mysijca4ibc.js", "src/s_skxgnvwvot8.js", "src/s_uve5im9h73c.js"], "symbols": ["s_hA9UPaY8sNQ", "s_mYsiJcA4IBc", "s_skxgNVWVOT8", "s_uVE5iM9H73c"] }, "q-7b18effb.js": { "size": 128, "imports": ["q-27c4ce8c.js"], "dynamicImports": ["q-143c7194.js"], "origins": ["@qwik-city-entries"] }, "q-83db7898.js": { "size": 641, "imports": ["q-27c4ce8c.js"], "origins": ["src/entry_jobPosition.js", "src/s_3nmkawu7ndy.js"], "symbols": ["s_3nmkaWu7nDY"] }, "q-8657cca8.js": { "size": 1372, "imports": ["q-27c4ce8c.js"], "dynamicImports": ["q-83db7898.js"], "origins": ["src/components/jobPosition/jobPosition.js", "src/entry_currentJobs.js", "src/s_ijsf1tq5lzs.js"], "symbols": ["s_iJSF1Tq5LZs"] }, "q-8682d256.js": { "size": 1489, "imports": ["q-27c4ce8c.js", "q-37c44283.js"], "dynamicImports": ["q-0db42049.js"], "origins": ["@builder.io/qwik/build", "src/entry_QwikCity.js", "src/s_aaalzkh0klq.js", "src/s_z1nvhyeppoi.js"], "symbols": ["s_AaAlzKH0KlQ", "s_z1nvHyEppoI"] }, "q-8985cbc8.js": { "size": 625, "imports": ["q-27c4ce8c.js"], "dynamicImports": ["q-2a9a7b07.js", "q-3a047c37.js", "q-8657cca8.js"], "origins": ["src/components/currentJobs/currentJobs.js", "src/components/header/header.js", "src/components/skills/skills.js", "src/entry_layout.js", "src/s_vklnxphuh5s.js"], "symbols": ["s_VkLNXphUh5s"] }, "q-94886fdd.js": { "size": 158, "imports": ["q-27c4ce8c.js"], "dynamicImports": ["q-8985cbc8.js"], "origins": ["src/routes/layout.js"] }, "q-a4b51c9b.js": { "size": 234, "imports": ["q-27c4ce8c.js"], "origins": ["src/entry_skill.js", "src/s_nzuf7lkryfa.js"], "symbols": ["s_nZuF7LKrYfA"] }, "q-ca031a9a.js": { "size": 299, "imports": ["q-27c4ce8c.js"], "dynamicImports": ["q-5832a244.js"], "origins": ["src/routes/index.js"] }, "q-d16bba3d.js": { "size": 58, "imports": ["q-27c4ce8c.js"] }, "q-de4c390e.js": { "size": 909, "imports": ["q-27c4ce8c.js", "q-37c44283.js"], "origins": ["src/entry_RouterHead.js", "src/s_zrbrqoaqxsy.js"], "symbols": ["s_zrbrqoaqXSY"] } }, "injections": [{ "tag": "link", "location": "head", "attributes": { "rel": "stylesheet", "href": "/build/q-a078d7e5.css" } }], "version": "1", "options": { "target": "client", "buildMode": "production", "forceFullBuild": true, "entryStrategy": { "type": "smart" } }, "platform": { "qwik": "0.9.0", "vite": "", "rollup": "2.78.1", "env": "node", "os": "darwin", "node": "16.17.0" } };
const isServer = true;
const isBrowser = false;
const ContentContext = /* @__PURE__ */ createContext$1("qc-c");
const ContentInternalContext = /* @__PURE__ */ createContext$1("qc-ic");
const DocumentHeadContext = /* @__PURE__ */ createContext$1("qc-h");
const RouteLocationContext = /* @__PURE__ */ createContext$1("qc-l");
const RouteNavigateContext = /* @__PURE__ */ createContext$1("qc-n");
const RouterOutlet = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const { contents } = useContext(ContentInternalContext);
  if (contents && contents.length > 0) {
    const contentsLen = contents.length;
    let cmp = null;
    for (let i = contentsLen - 1; i >= 0; i--)
      cmp = jsx(contents[i].default, {
        children: cmp
      });
    return cmp;
  }
  return SkipRender;
}, "RouterOutlet_component_nd8yk3KO22c"));
const MODULE_CACHE = /* @__PURE__ */ new WeakMap();
const loadRoute = async (routes2, menus2, cacheModules2, pathname) => {
  if (Array.isArray(routes2))
    for (const route of routes2) {
      const match = route[0].exec(pathname);
      if (match) {
        const loaders = route[1];
        const params = getRouteParams(route[2], match);
        const routeBundleNames = route[4];
        const mods = new Array(loaders.length);
        const pendingLoads = [];
        const menuLoader = getMenuLoader(menus2, pathname);
        let menu = void 0;
        loaders.forEach((moduleLoader, i) => {
          loadModule(moduleLoader, pendingLoads, (routeModule) => mods[i] = routeModule, cacheModules2);
        });
        loadModule(menuLoader, pendingLoads, (menuModule) => menu = menuModule == null ? void 0 : menuModule.default, cacheModules2);
        if (pendingLoads.length > 0)
          await Promise.all(pendingLoads);
        return [
          params,
          mods,
          menu,
          routeBundleNames
        ];
      }
    }
  return null;
};
const loadModule = (moduleLoader, pendingLoads, moduleSetter, cacheModules2) => {
  if (typeof moduleLoader === "function") {
    const loadedModule = MODULE_CACHE.get(moduleLoader);
    if (loadedModule)
      moduleSetter(loadedModule);
    else {
      const l = moduleLoader();
      if (typeof l.then === "function")
        pendingLoads.push(l.then((loadedModule2) => {
          if (cacheModules2 !== false)
            MODULE_CACHE.set(moduleLoader, loadedModule2);
          moduleSetter(loadedModule2);
        }));
      else if (l)
        moduleSetter(l);
    }
  }
};
const getMenuLoader = (menus2, pathname) => {
  if (menus2) {
    const menu = menus2.find((m) => m[0] === pathname || pathname.startsWith(m[0] + (pathname.endsWith("/") ? "" : "/")));
    if (menu)
      return menu[1];
  }
  return void 0;
};
const getRouteParams = (paramNames, match) => {
  const params = {};
  if (paramNames)
    for (let i = 0; i < paramNames.length; i++)
      params[paramNames[i]] = match ? match[i + 1] : "";
  return params;
};
const resolveHead = (endpoint, routeLocation, contentModules) => {
  const head2 = createDocumentHead();
  const headProps = {
    data: endpoint ? endpoint.body : null,
    head: head2,
    ...routeLocation
  };
  for (let i = contentModules.length - 1; i >= 0; i--) {
    const contentModuleHead = contentModules[i] && contentModules[i].head;
    if (contentModuleHead) {
      if (typeof contentModuleHead === "function")
        resolveDocumentHead(head2, contentModuleHead(headProps));
      else if (typeof contentModuleHead === "object")
        resolveDocumentHead(head2, contentModuleHead);
    }
  }
  return headProps.head;
};
const resolveDocumentHead = (resolvedHead, updatedHead) => {
  if (typeof updatedHead.title === "string")
    resolvedHead.title = updatedHead.title;
  mergeArray(resolvedHead.meta, updatedHead.meta);
  mergeArray(resolvedHead.links, updatedHead.links);
  mergeArray(resolvedHead.styles, updatedHead.styles);
};
const mergeArray = (existingArr, newArr) => {
  if (Array.isArray(newArr))
    for (const newItem of newArr) {
      if (typeof newItem.key === "string") {
        const existingIndex = existingArr.findIndex((i) => i.key === newItem.key);
        if (existingIndex > -1) {
          existingArr[existingIndex] = newItem;
          continue;
        }
      }
      existingArr.push(newItem);
    }
};
const createDocumentHead = () => ({
  title: "",
  meta: [],
  links: [],
  styles: []
});
const useDocumentHead = () => useContext(DocumentHeadContext);
const useLocation = () => useContext(RouteLocationContext);
const useNavigate = () => useContext(RouteNavigateContext);
const useQwikCityEnv = () => noSerialize(useEnvData("qwikcity"));
const toPath = (url) => url.pathname + url.search + url.hash;
const toUrl = (url, baseUrl) => new URL(url, baseUrl.href);
const isSameOrigin = (a, b) => a.origin === b.origin;
const isSamePath = (a, b) => a.pathname + a.search === b.pathname + b.search;
const isSamePathname = (a, b) => a.pathname === b.pathname;
const isSameOriginDifferentPathname = (a, b) => isSameOrigin(a, b) && !isSamePath(a, b);
const getClientEndpointPath = (pathname) => pathname + (pathname.endsWith("/") ? "" : "/") + "q-data.json";
const getClientNavPath = (props, baseUrl) => {
  const href = props.href;
  if (typeof href === "string" && href.trim() !== "" && typeof props.target !== "string")
    try {
      const linkUrl = toUrl(href, baseUrl);
      const currentUrl = toUrl("", baseUrl);
      if (isSameOrigin(linkUrl, currentUrl))
        return toPath(linkUrl);
    } catch (e) {
      console.error(e);
    }
  return null;
};
const getPrefetchUrl = (props, clientNavPath, currentLoc) => {
  if (props.prefetch && clientNavPath) {
    const prefetchUrl = toUrl(clientNavPath, currentLoc);
    if (!isSamePathname(prefetchUrl, toUrl("", currentLoc)))
      return prefetchUrl + "";
  }
  return null;
};
const clientNavigate = (win, routeNavigate) => {
  const currentUrl = win.location;
  const newUrl = toUrl(routeNavigate.path, currentUrl);
  if (isSameOriginDifferentPathname(currentUrl, newUrl)) {
    handleScroll(win, currentUrl, newUrl);
    win.history.pushState("", "", toPath(newUrl));
  }
  if (!win[CLIENT_HISTORY_INITIALIZED]) {
    win[CLIENT_HISTORY_INITIALIZED] = 1;
    win.addEventListener("popstate", () => {
      const currentUrl2 = win.location;
      const previousUrl = toUrl(routeNavigate.path, currentUrl2);
      if (isSameOriginDifferentPathname(currentUrl2, previousUrl)) {
        handleScroll(win, previousUrl, currentUrl2);
        routeNavigate.path = toPath(currentUrl2);
      }
    });
  }
};
const handleScroll = async (win, previousUrl, newUrl) => {
  const doc = win.document;
  const newHash = newUrl.hash;
  if (isSamePath(previousUrl, newUrl)) {
    if (previousUrl.hash !== newHash) {
      await domWait();
      if (newHash)
        scrollToHashId(doc, newHash);
      else
        win.scrollTo(0, 0);
    }
  } else {
    if (newHash)
      for (let i = 0; i < 24; i++) {
        await domWait();
        if (scrollToHashId(doc, newHash))
          break;
      }
    else {
      await domWait();
      win.scrollTo(0, 0);
    }
  }
};
const domWait = () => new Promise((resolve) => setTimeout(resolve, 12));
const scrollToHashId = (doc, hash) => {
  const elmId = hash.slice(1);
  const elm = doc.getElementById(elmId);
  if (elm)
    elm.scrollIntoView();
  return elm;
};
const dispatchPrefetchEvent = (prefetchData) => dispatchEvent(new CustomEvent("qprefetch", {
  detail: prefetchData
}));
const CLIENT_HISTORY_INITIALIZED = /* @__PURE__ */ Symbol();
const loadClientData = async (href) => {
  const { cacheModules: cacheModules2 } = await Promise.resolve().then(() => _qwikCityPlan);
  const pagePathname = new URL(href).pathname;
  const endpointUrl = getClientEndpointPath(pagePathname);
  const now = Date.now();
  const expiration = cacheModules2 ? 6e5 : 15e3;
  const cachedClientPageIndex = cachedClientPages.findIndex((c) => c.u === endpointUrl);
  let cachedClientPageData = cachedClientPages[cachedClientPageIndex];
  dispatchPrefetchEvent({
    links: [
      pagePathname
    ]
  });
  if (!cachedClientPageData || cachedClientPageData.t + expiration < now) {
    cachedClientPageData = {
      u: endpointUrl,
      t: now,
      c: new Promise((resolve) => {
        fetch(endpointUrl).then((clientResponse) => {
          const contentType = clientResponse.headers.get("content-type") || "";
          if (clientResponse.ok && contentType.includes("json"))
            clientResponse.json().then((clientData) => {
              dispatchPrefetchEvent({
                bundles: clientData.prefetch,
                links: [
                  pagePathname
                ]
              });
              resolve(clientData);
            }, () => resolve(null));
          else
            resolve(null);
        }, () => resolve(null));
      })
    };
    for (let i = cachedClientPages.length - 1; i >= 0; i--)
      if (cachedClientPages[i].t + expiration < now)
        cachedClientPages.splice(i, 1);
    cachedClientPages.push(cachedClientPageData);
  }
  cachedClientPageData.c.catch((e) => console.error(e));
  return cachedClientPageData.c;
};
const cachedClientPages = [];
const QwikCity = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const env = useQwikCityEnv();
  if (!(env == null ? void 0 : env.params))
    throw new Error(`Missing Qwik City Env Data`);
  const urlEnv = useEnvData("url");
  if (!urlEnv)
    throw new Error(`Missing Qwik URL Env Data`);
  const url = new URL(urlEnv);
  const routeLocation = useStore({
    href: url.href,
    pathname: url.pathname,
    query: Object.fromEntries(url.searchParams.entries()),
    params: env.params
  });
  const routeNavigate = useStore({
    path: toPath(url)
  });
  const documentHead = useStore(createDocumentHead);
  const content = useStore({
    headings: void 0,
    menu: void 0
  });
  const contentInternal = useStore({
    contents: void 0
  });
  useContextProvider(ContentContext, content);
  useContextProvider(ContentInternalContext, contentInternal);
  useContextProvider(DocumentHeadContext, documentHead);
  useContextProvider(RouteLocationContext, routeLocation);
  useContextProvider(RouteNavigateContext, routeNavigate);
  useWatchQrl(inlinedQrl(async ({ track }) => {
    const [content2, contentInternal2, documentHead2, env2, routeLocation2, routeNavigate2] = useLexicalScope();
    const { routes: routes2, menus: menus2, cacheModules: cacheModules2 } = await Promise.resolve().then(() => _qwikCityPlan);
    const path = track(routeNavigate2, "path");
    const url2 = new URL(path, routeLocation2.href);
    const pathname = url2.pathname;
    const loadRoutePromise = loadRoute(routes2, menus2, cacheModules2, pathname);
    const endpointResponse = isServer ? env2.response : loadClientData(url2.href);
    const loadedRoute = await loadRoutePromise;
    if (loadedRoute) {
      const [params, mods, menu] = loadedRoute;
      const contentModules = mods;
      const pageModule = contentModules[contentModules.length - 1];
      routeLocation2.href = url2.href;
      routeLocation2.pathname = pathname;
      routeLocation2.params = {
        ...params
      };
      routeLocation2.query = Object.fromEntries(url2.searchParams.entries());
      content2.headings = pageModule.headings;
      content2.menu = menu;
      contentInternal2.contents = noSerialize(contentModules);
      const clientPageData = await endpointResponse;
      const resolvedHead = resolveHead(clientPageData, routeLocation2, contentModules);
      documentHead2.links = resolvedHead.links;
      documentHead2.meta = resolvedHead.meta;
      documentHead2.styles = resolvedHead.styles;
      documentHead2.title = resolvedHead.title;
      if (isBrowser)
        clientNavigate(window, routeNavigate2);
    }
  }, "QwikCity_component_useWatch_AaAlzKH0KlQ", [
    content,
    contentInternal,
    documentHead,
    env,
    routeLocation,
    routeNavigate
  ]));
  return /* @__PURE__ */ jsx(Slot, {});
}, "QwikCity_component_z1nvHyEppoI"));
/* @__PURE__ */ componentQrl(inlinedQrl((props) => {
  const nav = useNavigate();
  const loc = useLocation();
  const originalHref = props.href;
  const linkProps = {
    ...props
  };
  const clientNavPath = getClientNavPath(linkProps, loc);
  const prefetchUrl = getPrefetchUrl(props, clientNavPath, loc);
  linkProps["preventdefault:click"] = !!clientNavPath;
  linkProps.href = clientNavPath || originalHref;
  return /* @__PURE__ */ jsx("a", {
    ...linkProps,
    onClick$: inlinedQrl(() => {
      const [clientNavPath2, linkProps2, nav2] = useLexicalScope();
      if (clientNavPath2)
        nav2.path = linkProps2.href;
    }, "Link_component_a_onClick_hA9UPaY8sNQ", [
      clientNavPath,
      linkProps,
      nav
    ]),
    "data-prefetch": prefetchUrl,
    onMouseOver$: inlinedQrl((_, elm) => prefetchLinkResources(elm), "Link_component_a_onMouseOver_skxgNVWVOT8"),
    onQVisible$: inlinedQrl((_, elm) => prefetchLinkResources(elm, true), "Link_component_a_onQVisible_uVE5iM9H73c"),
    children: /* @__PURE__ */ jsx(Slot, {})
  });
}, "Link_component_mYsiJcA4IBc"));
const prefetchLinkResources = (elm, isOnVisible) => {
  var _a2;
  const prefetchUrl = (_a2 = elm == null ? void 0 : elm.dataset) == null ? void 0 : _a2.prefetch;
  if (prefetchUrl) {
    if (!windowInnerWidth)
      windowInnerWidth = window.innerWidth;
    if (!isOnVisible || isOnVisible && windowInnerWidth < 520)
      loadClientData(prefetchUrl);
  }
};
let windowInnerWidth = 0;
const swRegister = '((s,a,r,i)=>{r=(e,t)=>{t=document.querySelector("[q\\\\:base]"),t&&a.active&&a.active.postMessage({type:"qprefetch",base:t.getAttribute("q:base"),...e})},addEventListener("qprefetch",e=>{const t=e.detail;a?r(t):t.bundles&&s.push(...t.bundles)}),navigator.serviceWorker.register("/service-worker.js").then(e=>{i=()=>{a=e,r({bundles:s})},e.installing?e.installing.addEventListener("statechange",t=>{t.target.state=="activated"&&i()}):e.active&&i()}).catch(e=>console.error(e))})([])';
const ServiceWorkerRegister = () => jsx("script", {
  dangerouslySetInnerHTML: swRegister
});
const RouterHead = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const head2 = useDocumentHead();
  const loc = useLocation();
  return /* @__PURE__ */ jsx(Fragment, {
    children: [
      /* @__PURE__ */ jsx("title", {
        children: head2.title
      }),
      /* @__PURE__ */ jsx("link", {
        rel: "canonical",
        href: loc.href
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      }),
      /* @__PURE__ */ jsx("link", {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg"
      }),
      /* @__PURE__ */ jsx("link", {
        rel: "preconnect",
        href: "https://fonts.googleapis.com"
      }),
      /* @__PURE__ */ jsx("link", {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: ""
      }),
      /* @__PURE__ */ jsx("link", {
        href: "https://fonts.googleapis.com/css2?family=Poppins&display=swap",
        rel: "stylesheet"
      }),
      /* @__PURE__ */ jsx("meta", {
        property: "og:site_name",
        content: "Qwik"
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "twitter:site",
        content: "@QwikDev"
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "twitter:title",
        content: "Qwik"
      }),
      head2.meta.map((m) => /* @__PURE__ */ jsx("meta", {
        ...m
      })),
      head2.links.map((l) => /* @__PURE__ */ jsx("link", {
        ...l
      })),
      head2.styles.map((s) => /* @__PURE__ */ jsx("style", {
        ...s.props,
        dangerouslySetInnerHTML: s.style
      }))
    ]
  });
}, "s_zrbrqoaqXSY"));
const global$1 = "";
const Root = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx(QwikCity, {
    children: [
      /* @__PURE__ */ jsx("head", {
        children: [
          /* @__PURE__ */ jsx("meta", {
            charSet: "utf-8"
          }),
          /* @__PURE__ */ jsx(RouterHead, {})
        ]
      }),
      /* @__PURE__ */ jsx("body", {
        lang: "en",
        children: [
          /* @__PURE__ */ jsx(RouterOutlet, {}),
          /* @__PURE__ */ jsx(ServiceWorkerRegister, {})
        ]
      })
    ]
  });
}, "s_3sccYCDd1Z0"));
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
function render(opts) {
  return renderToStream(/* @__PURE__ */ jsx(Root, {}), __spreadProps(__spreadValues({
    manifest
  }, opts), {
    prefetchStrategy: {
      implementation: {
        linkInsert: null,
        workerFetchInsert: null,
        prefetchEvent: "always"
      }
    }
  }));
}
const qwikCityHandler = qwikCity(render);
export {
  qwikCityHandler as default
};
