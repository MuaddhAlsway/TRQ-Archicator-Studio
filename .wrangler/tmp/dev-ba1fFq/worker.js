var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// .wrangler/tmp/bundle-4GY1Tb/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
var init_strip_cf_connecting_ip_header = __esm({
  ".wrangler/tmp/bundle-4GY1Tb/strip-cf-connecting-ip-header.js"() {
    __name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        return Reflect.apply(target, thisArg, [
          stripCfConnectingIPHeader.apply(null, argArray)
        ]);
      }
    });
  }
});

// node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    __name(PerformanceEntry, "PerformanceEntry");
    PerformanceMark = /* @__PURE__ */ __name(class PerformanceMark2 extends PerformanceEntry {
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    }, "PerformanceMark");
    PerformanceMeasure = class extends PerformanceEntry {
      entryType = "measure";
    };
    __name(PerformanceMeasure, "PerformanceMeasure");
    PerformanceResourceTiming = class extends PerformanceEntry {
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    __name(PerformanceResourceTiming, "PerformanceResourceTiming");
    PerformanceObserverEntryList = class {
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    __name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
    Performance = class {
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e2) => e2.name !== markName) : this._entries.filter((e2) => e2.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e2) => e2.name !== measureName) : this._entries.filter((e2) => e2.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e2) => e2.entryType !== "resource" || e2.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e2) => e2.name === name && (!type || e2.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e2) => e2.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    __name(Performance, "Performance");
    PerformanceObserver = class {
      __unenv__ = true;
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    __name(PerformanceObserver, "PerformanceObserver");
    __publicField(PerformanceObserver, "supportedEntryTypes", []);
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var ReadStream;
var init_read_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class extends Socket {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      isRaw = false;
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
      isTTY = false;
    };
    __name(ReadStream, "ReadStream");
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream;
var init_write_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class extends Socket2 {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      columns = 80;
      rows = 24;
      isTTY = false;
    };
    __name(WriteStream, "WriteStream");
  }
});

// node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    Process = class extends EventEmitter {
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return "";
      }
      get versions() {
        return {};
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      ref() {
      }
      unref() {
      }
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: () => 0 });
      mainModule = void 0;
      domain = void 0;
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
    __name(Process, "Process");
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, exit, platform, nextTick, unenvProcess, abort, addListener, allowedNodeEnvironmentFlags, hasUncaughtExceptionCaptureCallback, setUncaughtExceptionCaptureCallback, loadEnvFile, sourceMapsEnabled, arch, argv, argv0, chdir, config, connected, constrainedMemory, availableMemory, cpuUsage, cwd, debugPort, dlopen, disconnect, emit, emitWarning, env, eventNames, execArgv, execPath, finalization, features, getActiveResourcesInfo, getMaxListeners, hrtime3, kill, listeners, listenerCount, memoryUsage, on, off, once, pid, ppid, prependListener, prependOnceListener, rawListeners, release, removeAllListeners, removeListener, report, resourceUsage, setMaxListeners, setSourceMapsEnabled, stderr, stdin, stdout, title, throwDeprecation, traceDeprecation, umask, uptime, version, versions, domain, initgroups, moduleLoadList, reallyExit, openStdin, assert2, binding, send, exitCode, channel, getegid, geteuid, getgid, getgroups, getuid, setegid, seteuid, setgid, setgroups, setuid, permission, mainModule, _events, _eventsCount, _exiting, _maxListeners, _debugEnd, _debugProcess, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, _disconnect, _handleQueue, _pendingMessage, _channel, _send, _linkedBinding, _process, process_default;
var init_process2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    ({ exit, platform, nextTick } = getBuiltinModule(
      "node:process"
    ));
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      nextTick
    });
    ({
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      finalization,
      features,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      on,
      off,
      once,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/itty-router-extras/middleware/withContent.js
var require_withContent = __commonJS({
  "node_modules/itty-router-extras/middleware/withContent.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var withContent = /* @__PURE__ */ __name(async (t) => {
      let n = t.headers.get("content-type");
      t.content = void 0;
      try {
        n && n.includes("application/json") && (t.content = await t.json());
      } catch (t2) {
      }
    }, "withContent");
    module.exports = { withContent };
  }
});

// node_modules/itty-router-extras/middleware/withCookies.js
var require_withCookies = __commonJS({
  "node_modules/itty-router-extras/middleware/withCookies.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var withCookies = /* @__PURE__ */ __name((o2) => {
      o2.cookies = {};
      try {
        o2.cookies = (o2.headers.get("Cookie") || "").split(/;\s*/).map((o3) => o3.split(/=(.+)/)).reduce((o3, [e2, i2]) => (o3[e2] = i2, o3), {});
      } catch (o3) {
      }
    }, "withCookies");
    module.exports = { withCookies };
  }
});

// node_modules/itty-router-extras/middleware/withParams.js
var require_withParams = __commonJS({
  "node_modules/itty-router-extras/middleware/withParams.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var withParams = /* @__PURE__ */ __name((a) => {
      for (const s2 in a.params || {})
        a[s2] = a.params[s2];
    }, "withParams");
    module.exports = { withParams };
  }
});

// node_modules/itty-router-extras/middleware/index.js
var require_middleware = __commonJS({
  "node_modules/itty-router-extras/middleware/index.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = { ...require_withContent(), ...require_withCookies(), ...require_withParams() };
  }
});

// node_modules/itty-router-extras/response/createResponseType.js
var require_createResponseType = __commonJS({
  "node_modules/itty-router-extras/response/createResponseType.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var createResponseType = /* @__PURE__ */ __name((e2 = "text/plain; charset=utf-8") => (s2, t = {}) => {
      const { headers: n = {}, ...o2 } = t;
      return "object" == typeof s2 ? new Response(JSON.stringify(s2), { headers: { "Content-Type": e2, ...n }, ...o2 }) : new Response(s2, t);
    }, "createResponseType");
    module.exports = { createResponseType };
  }
});

// node_modules/itty-router-extras/response/json.js
var require_json = __commonJS({
  "node_modules/itty-router-extras/response/json.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { createResponseType } = require_createResponseType();
    var json8 = createResponseType("application/json; charset=utf-8");
    module.exports = { json: json8 };
  }
});

// node_modules/itty-router-extras/response/error.js
var require_error = __commonJS({
  "node_modules/itty-router-extras/response/error.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { json: json8 } = require_json();
    var error3 = /* @__PURE__ */ __name((r = 500, o2 = "Internal Server Error.") => json8({ ..."object" == typeof o2 ? o2 : { status: r, error: o2 } }, { status: r }), "error");
    module.exports = { error: error3 };
  }
});

// node_modules/itty-router-extras/response/missing.js
var require_missing = __commonJS({
  "node_modules/itty-router-extras/response/missing.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { error: error3 } = require_error();
    var missing = /* @__PURE__ */ __name((r = "Not found.") => error3(404, r), "missing");
    module.exports = { missing };
  }
});

// node_modules/itty-router-extras/response/status.js
var require_status = __commonJS({
  "node_modules/itty-router-extras/response/status.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { json: json8 } = require_json();
    var status = /* @__PURE__ */ __name((s2, t) => t ? json8({ ..."object" == typeof t ? t : { status: s2, message: t } }, { status: s2 }) : new Response(null, { status: s2 }), "status");
    module.exports = { status };
  }
});

// node_modules/itty-router-extras/response/text.js
var require_text = __commonJS({
  "node_modules/itty-router-extras/response/text.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var text = /* @__PURE__ */ __name((e2, t = {}) => new Response(e2, t), "text");
    module.exports = { text };
  }
});

// node_modules/itty-router-extras/response/index.js
var require_response = __commonJS({
  "node_modules/itty-router-extras/response/index.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = { ...require_error(), ...require_json(), ...require_missing(), ...require_status(), ...require_text() };
  }
});

// node_modules/itty-router/index.js
var require_itty_router = __commonJS({
  "node_modules/itty-router/index.js"(exports) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var e2 = class extends Error {
      status;
      constructor(e3 = 500, t2) {
        super("object" == typeof t2 ? t2.error : t2), "object" == typeof t2 && Object.assign(this, t2), this.status = e3;
      }
    };
    __name(e2, "e");
    var t = /* @__PURE__ */ __name((e3 = "text/plain; charset=utf-8", t2) => (o3, { headers: s3 = {}, ...r2 } = {}) => void 0 === o3 || "Response" === o3?.constructor.name ? o3 : new Response(t2 ? t2(o3) : o3, { headers: { "content-type": e3, ...s3.entries ? Object.fromEntries(s3) : s3 }, ...r2 }), "t");
    var o2 = t("application/json; charset=utf-8", JSON.stringify);
    var s2 = /* @__PURE__ */ __name((e3) => ({ 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 500: "Internal Server Error" })[e3] || "Unknown Error", "s");
    var r = t("text/plain; charset=utf-8", String);
    var n = t("text/html");
    var a = t("image/jpeg");
    var c2 = t("image/png");
    var p2 = t("image/webp");
    exports.Router = ({ base: e3 = "", routes: t2 = [], ...o3 } = {}) => ({ __proto__: new Proxy({}, { get: (o4, s3, r2, n2) => "handle" == s3 ? r2.fetch : (o5, ...a2) => t2.push([s3.toUpperCase?.(), RegExp(`^${(n2 = (e3 + o5).replace(/\/+(\/|$)/g, "$1")).replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`), a2, n2]) && r2 }), routes: t2, ...o3, async fetch(e4, ...o4) {
      let s3, r2, n2 = new URL(e4.url), a2 = e4.query = { __proto__: null };
      for (let [e5, t3] of n2.searchParams)
        a2[e5] = a2[e5] ? [].concat(a2[e5], t3) : t3;
      for (let [a3, c3, p3, i2] of t2)
        if ((a3 == e4.method || "ALL" == a3) && (r2 = n2.pathname.match(c3))) {
          e4.params = r2.groups || {}, e4.route = i2;
          for (let t3 of p3)
            if (null != (s3 = await t3(e4.proxy ?? e4, ...o4)))
              return s3;
        }
    } }), exports.StatusError = e2, exports.createCors = (e3 = {}) => {
      const { origins: t2 = ["*"], maxAge: o3, methods: s3 = ["GET"], headers: r2 = {} } = e3;
      let n2;
      const a2 = "function" == typeof t2 ? t2 : (e4) => t2.includes(e4) || t2.includes("*"), c3 = { "content-type": "application/json", "Access-Control-Allow-Methods": s3.join(", "), ...r2 };
      o3 && (c3["Access-Control-Max-Age"] = o3);
      return { corsify: (e4) => {
        if (!e4)
          throw new Error("No fetch handler responded and no upstream to proxy to specified.");
        const { headers: t3, status: o4, body: s4 } = e4;
        return [101, 301, 302, 308].includes(o4) || t3.get("access-control-allow-origin") ? e4 : new Response(s4, { status: o4, headers: { ...Object.fromEntries(t3), ...c3, ...n2, "content-type": t3.get("content-type") } });
      }, preflight: (e4) => {
        const t3 = [.../* @__PURE__ */ new Set(["OPTIONS", ...s3])], o4 = e4.headers.get("origin") || "";
        if (n2 = a2(o4) && { "Access-Control-Allow-Origin": o4 }, "OPTIONS" === e4.method) {
          const o5 = { ...c3, "Access-Control-Allow-Methods": t3.join(", "), "Access-Control-Allow-Headers": e4.headers.get("Access-Control-Request-Headers"), ...n2 };
          return new Response(null, { headers: e4.headers.get("Origin") && e4.headers.get("Access-Control-Request-Method") && e4.headers.get("Access-Control-Request-Headers") ? o5 : { Allow: t3.join(", ") } });
        }
      } };
    }, exports.createResponse = t, exports.error = (e3 = 500, t2) => {
      if (e3 instanceof Error) {
        const { message: o3, ...r2 } = e3;
        e3 = e3.status || 500, t2 = { error: o3 || s2(e3), ...r2 };
      }
      return t2 = { status: e3, ..."object" == typeof t2 ? t2 : { error: t2 || s2(e3) } }, o2(t2, { status: e3 });
    }, exports.html = n, exports.jpeg = a, exports.json = o2, exports.png = c2, exports.status = (e3, t2) => new Response(null, { ...t2, status: e3 }), exports.text = r, exports.webp = p2, exports.withContent = async (e3) => {
      e3.content = e3.body ? await e3.clone().json().catch(() => e3.clone().formData()).catch(() => e3.text()) : void 0;
    }, exports.withCookies = (e3) => {
      e3.cookies = (e3.headers.get("Cookie") || "").split(/;\s*/).map((e4) => e4.split(/=(.+)/)).reduce((e4, [t2, o3]) => o3 ? (e4[t2] = o3, e4) : e4, {});
    }, exports.withParams = (e3) => {
      e3.proxy = new Proxy(e3.proxy || e3, { get: (t2, o3) => void 0 !== t2[o3] ? t2[o3].bind?.(e3) || t2[o3] : t2?.params?.[o3] });
    };
  }
});

// node_modules/itty-router-extras/router/ThrowableRouter.js
var require_ThrowableRouter = __commonJS({
  "node_modules/itty-router-extras/router/ThrowableRouter.js"(exports, module) {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { Router } = require_itty_router();
    var { error: error3 } = require_response();
    var ThrowableRouter = /* @__PURE__ */ __name((r = {}) => {
      const { stack: e2 = false } = r;
      return new Proxy(Router(r), { get: (r2, t) => (...o2) => "handle" === t ? r2[t](...o2).catch((r3) => error3(r3.status || 500, { status: r3.status || 500, error: r3.message, stack: e2 && r3.stack || void 0 })) : r2[t](...o2) });
    }, "ThrowableRouter");
    module.exports = { ThrowableRouter };
  }
});

// node_modules/itty-router-extras/router/index.js
var require_router = __commonJS({
  "node_modules/itty-router-extras/router/index.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = { ...require_ThrowableRouter() };
  }
});

// node_modules/itty-router-extras/classes/StatusError.js
var require_StatusError = __commonJS({
  "node_modules/itty-router-extras/classes/StatusError.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var StatusError = class extends Error {
      constructor(r = 500, t = "Internal Error.") {
        super(t), this.name = "StatusError", this.status = r;
      }
    };
    __name(StatusError, "StatusError");
    module.exports = { StatusError };
  }
});

// node_modules/itty-router-extras/classes/index.js
var require_classes = __commonJS({
  "node_modules/itty-router-extras/classes/index.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = { ...require_StatusError() };
  }
});

// node_modules/itty-router-extras/index.js
var require_itty_router_extras = __commonJS({
  "node_modules/itty-router-extras/index.js"(exports, module) {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = { ...require_middleware(), ...require_response(), ...require_router(), ...require_classes() };
  }
});

// .wrangler/tmp/bundle-4GY1Tb/middleware-loader.entry.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-4GY1Tb/middleware-insertion-facade.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/worker.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/itty-router/index.mjs
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var e = /* @__PURE__ */ __name(({ base: e2 = "", routes: t = [], ...o2 } = {}) => ({ __proto__: new Proxy({}, { get: (o3, s2, r, n) => "handle" == s2 ? r.fetch : (o4, ...a) => t.push([s2.toUpperCase?.(), RegExp(`^${(n = (e2 + o4).replace(/\/+(\/|$)/g, "$1")).replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`), a, n]) && r }), routes: t, ...o2, async fetch(e3, ...o3) {
  let s2, r, n = new URL(e3.url), a = e3.query = { __proto__: null };
  for (let [e4, t2] of n.searchParams)
    a[e4] = a[e4] ? [].concat(a[e4], t2) : t2;
  for (let [a2, c2, i2, l2] of t)
    if ((a2 == e3.method || "ALL" == a2) && (r = n.pathname.match(c2))) {
      e3.params = r.groups || {}, e3.route = l2;
      for (let t2 of i2)
        if (null != (s2 = await t2(e3.proxy ?? e3, ...o3)))
          return s2;
    }
} }), "e");
var o = /* @__PURE__ */ __name((e2 = "text/plain; charset=utf-8", t) => (o2, { headers: s2 = {}, ...r } = {}) => void 0 === o2 || "Response" === o2?.constructor.name ? o2 : new Response(t ? t(o2) : o2, { headers: { "content-type": e2, ...s2.entries ? Object.fromEntries(s2) : s2 }, ...r }), "o");
var s = o("application/json; charset=utf-8", JSON.stringify);
var c = o("text/plain; charset=utf-8", String);
var i = o("text/html");
var l = o("image/jpeg");
var p = o("image/png");
var d = o("image/webp");

// src/worker.js
var import_itty_router_extras9 = __toESM(require_itty_router_extras(), 1);

// src/middleware/cors.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://trqlatestversion.trq-efw.pages.dev",
  "https://trq-studio.pages.dev"
];
var ALLOWED_ORIGINS_REGEX = [
  /\.trq-efw\.pages\.dev$/,
  /\.trq-studio-7ie\.pages\.dev$/
];
function isOriginAllowed(origin) {
  if (ALLOWED_ORIGINS.includes(origin))
    return true;
  return ALLOWED_ORIGINS_REGEX.some((regex) => regex.test(origin));
}
__name(isOriginAllowed, "isOriginAllowed");
function handleCors(request) {
  const origin = request.headers.get("origin");
  const isAllowed = isOriginAllowed(origin);
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": isAllowed ? origin : "",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
        "Access-Control-Allow-Credentials": "true"
      }
    });
  }
  request.corsHeaders = {
    "Access-Control-Allow-Origin": isAllowed ? origin : "",
    "Access-Control-Allow-Credentials": "true"
  };
}
__name(handleCors, "handleCors");
function addCorsHeaders(response, corsHeaders) {
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    if (value)
      newHeaders.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
__name(addCorsHeaders, "addCorsHeaders");

// src/middleware/auth.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_itty_router_extras = __toESM(require_itty_router_extras(), 1);
async function authenticateToken(request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return (0, import_itty_router_extras.error)(401, "Access token required");
  }
  try {
    const decoded = await verifyToken(token, request.env.JWT_SECRET);
    request.user = decoded;
    request.authenticated = true;
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return (0, import_itty_router_extras.error)(401, "Invalid or expired token");
  }
}
__name(authenticateToken, "authenticateToken");
async function verifyToken(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3)
    throw new Error("Invalid token format");
  const [headerB64, payloadB64, signatureB64] = parts;
  const payload = JSON.parse(
    new TextDecoder().decode(
      Uint8Array.from(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")), (c2) => c2.charCodeAt(0))
    )
  );
  if (payload.exp && payload.exp * 1e3 < Date.now()) {
    throw new Error("Token expired");
  }
  return payload;
}
__name(verifyToken, "verifyToken");
function generateToken(payload, secret, expiresIn = 3600) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1e3);
  const exp = now + expiresIn;
  const tokenPayload = {
    ...payload,
    iat: now,
    exp
  };
  const headerB64 = btoa(JSON.stringify(header));
  const payloadB64 = btoa(JSON.stringify(tokenPayload));
  return `${headerB64}.${payloadB64}.signature`;
}
__name(generateToken, "generateToken");

// src/middleware/rateLimit.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_itty_router_extras2 = __toESM(require_itty_router_extras(), 1);
var RATE_LIMITS = {
  "/api/auth/login": { requests: 5, window: 900 },
  // 5 requests per 15 minutes
  "/api/upload": { requests: 10, window: 3600 },
  // 10 requests per hour
  default: { requests: 100, window: 60 }
  // 100 requests per minute
};
async function rateLimitMiddleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  if (path === "/api/health")
    return;
  const clientIp = request.headers.get("cf-connecting-ip") || "unknown";
  const limit = RATE_LIMITS[path] || RATE_LIMITS.default;
  const key = `ratelimit:${clientIp}:${path}`;
  try {
    const current = await request.env.RATE_LIMIT.get(key);
    const count3 = current ? parseInt(current) + 1 : 1;
    if (count3 > limit.requests) {
      return (0, import_itty_router_extras2.error)(429, "Too many requests");
    }
    await request.env.RATE_LIMIT.put(key, count3.toString(), {
      expirationTtl: limit.window
    });
  } catch (err) {
    console.error("Rate limit check failed:", err);
  }
}
__name(rateLimitMiddleware, "rateLimitMiddleware");

// src/routes/projects.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_itty_router_extras3 = __toESM(require_itty_router_extras(), 1);

// src/utils/cache.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var CACHE_TTL = {
  settings: 600,
  // 10 minutes
  services: 300,
  // 5 minutes
  slides: 300,
  // 5 minutes
  projects: 120,
  // 2 minutes
  projectDetail: 60
  // 1 minute
};
async function getCached(key, env2) {
  try {
    const cached = await env2.CACHE.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error("Cache get error:", err);
  }
  return null;
}
__name(getCached, "getCached");
async function setCached(key, value, env2, ttl = 300) {
  try {
    await env2.CACHE.put(key, JSON.stringify(value), {
      expirationTtl: ttl
    });
  } catch (err) {
    console.error("Cache set error:", err);
  }
}
__name(setCached, "setCached");
async function deleteCached(key, env2) {
  try {
    await env2.CACHE.delete(key);
  } catch (err) {
    console.error("Cache delete error:", err);
  }
}
__name(deleteCached, "deleteCached");
function getCacheHeaders(ttl = 300) {
  return {
    "Cache-Control": `public, max-age=${ttl}`,
    "CDN-Cache-Control": `max-age=${ttl}`
  };
}
__name(getCacheHeaders, "getCacheHeaders");
var CACHE_KEYS = {
  settings: "cache:settings",
  services: "cache:services",
  slides: "cache:slides",
  projects: "cache:projects",
  projectDetail: (id) => `cache:project:${id}`
};

// src/routes/projects.js
var projects_default = {
  async getAll(request) {
    const db = request.env.DB;
    const env2 = request.env;
    try {
      const cached = await getCached(CACHE_KEYS.projects, env2);
      if (cached) {
        return addCorsHeaders(
          (0, import_itty_router_extras3.json)(cached, { headers: getCacheHeaders(CACHE_TTL.projects) }),
          request.corsHeaders
        );
      }
      const projects = await db.prepare(`
          SELECT 
            id, title, category, description, image, year, 
            location, client, status, sortOrder
          FROM projects 
          ORDER BY sortOrder ASC, id ASC
        `).all();
      const data = projects.results || [];
      await setCached(CACHE_KEYS.projects, data, env2, CACHE_TTL.projects);
      return addCorsHeaders(
        (0, import_itty_router_extras3.json)(data, { headers: getCacheHeaders(CACHE_TTL.projects) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error("Error fetching projects:", err);
      return addCorsHeaders((0, import_itty_router_extras3.error)(500, "Server error"), request.corsHeaders);
    }
  },
  async getPublished(request) {
    const db = request.env.DB;
    const env2 = request.env;
    try {
      const projects = await db.prepare(`
          SELECT 
            id, title, category, description, image, year, 
            location, client, status, sortOrder
          FROM projects 
          WHERE status = 'published'
          ORDER BY sortOrder ASC, id ASC
        `).all();
      const data = projects.results || [];
      return addCorsHeaders(
        (0, import_itty_router_extras3.json)(data, { headers: getCacheHeaders(CACHE_TTL.projects) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error("Error fetching published projects:", err);
      return addCorsHeaders((0, import_itty_router_extras3.error)(500, "Server error"), request.corsHeaders);
    }
  },
  async getById(request) {
    const db = request.env.DB;
    const env2 = request.env;
    const { id } = request.params;
    try {
      const cacheKey = CACHE_KEYS.projectDetail(id);
      const cached = await getCached(cacheKey, env2);
      if (cached) {
        return addCorsHeaders(
          (0, import_itty_router_extras3.json)(cached, { headers: getCacheHeaders(CACHE_TTL.projectDetail) }),
          request.corsHeaders
        );
      }
      const project = await db.prepare("SELECT * FROM projects WHERE id = ?").bind(id).first();
      if (!project) {
        return addCorsHeaders((0, import_itty_router_extras3.error)(404, "Project not found"), request.corsHeaders);
      }
      const parsed = parseProjectData(project);
      await setCached(cacheKey, parsed, env2, CACHE_TTL.projectDetail);
      return addCorsHeaders(
        (0, import_itty_router_extras3.json)(parsed, { headers: getCacheHeaders(CACHE_TTL.projectDetail) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error("Error fetching project:", err);
      return addCorsHeaders((0, import_itty_router_extras3.error)(500, "Server error"), request.corsHeaders);
    }
  },
  async create(request) {
    const db = request.env.DB;
    const env2 = request.env;
    try {
      const body = await request.json();
      const {
        title: title2,
        category,
        description,
        image,
        year,
        location,
        client,
        status,
        title_ar,
        category_ar,
        description_ar,
        location_ar,
        client_ar,
        features: features2,
        materials,
        awards,
        team,
        gallery,
        features_ar,
        materials_ar,
        awards_ar,
        team_ar
      } = body;
      const result = await db.prepare(`
          INSERT INTO projects (
            title, category, description, image, year, location, client, status,
            title_ar, category_ar, description_ar, location_ar, client_ar,
            features, materials, awards, team, gallery,
            features_ar, materials_ar, awards_ar, team_ar
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
        title2,
        category,
        description,
        image,
        year,
        location,
        client,
        status || "draft",
        title_ar,
        category_ar,
        description_ar,
        location_ar,
        client_ar,
        JSON.stringify(features2 || []),
        JSON.stringify(materials || []),
        JSON.stringify(awards || []),
        JSON.stringify(team || []),
        JSON.stringify(gallery || []),
        JSON.stringify(features_ar || []),
        JSON.stringify(materials_ar || []),
        JSON.stringify(awards_ar || []),
        JSON.stringify(team_ar || [])
      ).run();
      await deleteCached(CACHE_KEYS.projects, env2);
      const newProject = await db.prepare("SELECT * FROM projects WHERE id = ?").bind(result.meta.last_row_id).first();
      return addCorsHeaders((0, import_itty_router_extras3.json)(parseProjectData(newProject)), request.corsHeaders);
    } catch (err) {
      console.error("Error creating project:", err);
      return addCorsHeaders((0, import_itty_router_extras3.error)(500, "Server error"), request.corsHeaders);
    }
  },
  async update(request) {
    const db = request.env.DB;
    const env2 = request.env;
    const { id } = request.params;
    try {
      const body = await request.json();
      const {
        title: title2,
        category,
        description,
        image,
        year,
        location,
        client,
        status,
        title_ar,
        category_ar,
        description_ar,
        location_ar,
        client_ar,
        features: features2,
        materials,
        awards,
        team,
        gallery,
        features_ar,
        materials_ar,
        awards_ar,
        team_ar
      } = body;
      await db.prepare(`
          UPDATE projects SET
            title=?, category=?, description=?, image=?, year=?, location=?, client=?, status=?,
            title_ar=?, category_ar=?, description_ar=?, location_ar=?, client_ar=?,
            features=?, materials=?, awards=?, team=?, gallery=?,
            features_ar=?, materials_ar=?, awards_ar=?, team_ar=?,
            updatedAt=CURRENT_TIMESTAMP
          WHERE id=?
        `).bind(
        title2,
        category,
        description,
        image,
        year,
        location,
        client,
        status,
        title_ar,
        category_ar,
        description_ar,
        location_ar,
        client_ar,
        JSON.stringify(features2 || []),
        JSON.stringify(materials || []),
        JSON.stringify(awards || []),
        JSON.stringify(team || []),
        JSON.stringify(gallery || []),
        JSON.stringify(features_ar || []),
        JSON.stringify(materials_ar || []),
        JSON.stringify(awards_ar || []),
        JSON.stringify(team_ar || []),
        id
      ).run();
      await deleteCached(CACHE_KEYS.projects, env2);
      await deleteCached(CACHE_KEYS.projectDetail(id), env2);
      const updated = await db.prepare("SELECT * FROM projects WHERE id = ?").bind(id).first();
      return addCorsHeaders((0, import_itty_router_extras3.json)(parseProjectData(updated)), request.corsHeaders);
    } catch (err) {
      console.error("Error updating project:", err);
      return addCorsHeaders((0, import_itty_router_extras3.error)(500, "Server error"), request.corsHeaders);
    }
  },
  async delete(request) {
    const db = request.env.DB;
    const env2 = request.env;
    const { id } = request.params;
    try {
      await db.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
      await deleteCached(CACHE_KEYS.projects, env2);
      await deleteCached(CACHE_KEYS.projectDetail(id), env2);
      return addCorsHeaders((0, import_itty_router_extras3.json)({ success: true }), request.corsHeaders);
    } catch (err) {
      console.error("Error deleting project:", err);
      return addCorsHeaders((0, import_itty_router_extras3.error)(500, "Server error"), request.corsHeaders);
    }
  }
};
function parseProjectData(project) {
  if (!project)
    return null;
  return {
    ...project,
    features: tryParse(project.features),
    materials: tryParse(project.materials),
    awards: tryParse(project.awards),
    team: tryParse(project.team),
    gallery: tryParse(project.gallery),
    features_ar: tryParse(project.features_ar),
    materials_ar: tryParse(project.materials_ar),
    awards_ar: tryParse(project.awards_ar),
    team_ar: tryParse(project.team_ar)
  };
}
__name(parseProjectData, "parseProjectData");
function tryParse(value) {
  if (!value)
    return [];
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return [];
  }
}
__name(tryParse, "tryParse");

// src/routes/slides.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_itty_router_extras4 = __toESM(require_itty_router_extras(), 1);
var slides_default = {
  async getAll(request) {
    const db = request.env.DB;
    const env2 = request.env;
    try {
      const cached = await getCached(CACHE_KEYS.slides, env2);
      if (cached) {
        return addCorsHeaders(
          (0, import_itty_router_extras4.json)(cached, { headers: getCacheHeaders(CACHE_TTL.slides) }),
          request.corsHeaders
        );
      }
      const slides = await db.prepare("SELECT * FROM hero_slides ORDER BY sortOrder ASC").all();
      const data = (slides.results || []).map(parseSlideData);
      await setCached(CACHE_KEYS.slides, data, env2, CACHE_TTL.slides);
      return addCorsHeaders(
        (0, import_itty_router_extras4.json)(data, { headers: getCacheHeaders(CACHE_TTL.slides) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error("Error fetching slides:", err);
      return addCorsHeaders((0, import_itty_router_extras4.error)(500, "Server error"), request.corsHeaders);
    }
  },
  async getActive(request) {
    const db = request.env.DB;
    try {
      const slides = await db.prepare("SELECT * FROM hero_slides WHERE isActive = 1 ORDER BY sortOrder ASC").all();
      const data = (slides.results || []).map(parseSlideData);
      return addCorsHeaders(
        (0, import_itty_router_extras4.json)(data, { headers: getCacheHeaders(CACHE_TTL.slides) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error("Error fetching active slides:", err);
      return addCorsHeaders((0, import_itty_router_extras4.error)(500, "Server error"), request.corsHeaders);
    }
  },
  async create(request) {
    const db = request.env.DB;
    const env2 = request.env;
    try {
      const body = await request.json();
      const {
        tag,
        title: title2,
        description,
        image,
        video,
        video_2,
        video_3,
        video_text,
        video_2_text,
        video_3_text,
        buttonPrimaryText,
        buttonPrimaryLink,
        buttonSecondaryText,
        buttonSecondaryLink,
        sortOrder,
        isActive,
        tag_ar,
        title_ar,
        description_ar,
        video_ar,
        video_2_ar,
        video_3_ar,
        video_text_ar,
        video_2_text_ar,
        video_3_text_ar,
        buttonPrimaryText_ar,
        buttonSecondaryText_ar
      } = body;
      const result = await db.prepare(`
          INSERT INTO hero_slides (
            tag, title, description, image, video, video_2, video_3,
            video_text, video_2_text, video_3_text,
            buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink,
            sortOrder, isActive,
            tag_ar, title_ar, description_ar, video_ar, video_2_ar, video_3_ar,
            video_text_ar, video_2_text_ar, video_3_text_ar,
            buttonPrimaryText_ar, buttonSecondaryText_ar
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
        tag,
        title2,
        description,
        image,
        video,
        video_2,
        video_3,
        video_text,
        video_2_text,
        video_3_text,
        buttonPrimaryText || "VIEW PORTFOLIO",
        buttonPrimaryLink || "portfolio",
        buttonSecondaryText || "GET IN TOUCH",
        buttonSecondaryLink || "contact",
        sortOrder || 0,
        isActive !== void 0 ? isActive : 1,
        tag_ar,
        title_ar,
        description_ar,
        video_ar,
        video_2_ar,
        video_3_ar,
        video_text_ar,
        video_2_text_ar,
        video_3_text_ar,
        buttonPrimaryText_ar,
        buttonSecondaryText_ar
      ).run();
      await deleteCached(CACHE_KEYS.slides, env2);
      const newSlide = await db.prepare("SELECT * FROM hero_slides WHERE id = ?").bind(result.meta.last_row_id).first();
      return addCorsHeaders((0, import_itty_router_extras4.json)(parseSlideData(newSlide)), request.corsHeaders);
    } catch (err) {
      console.error("Error creating slide:", err);
      return addCorsHeaders((0, import_itty_router_extras4.error)(500, "Server error"), request.corsHeaders);
    }
  },
  async update(request) {
    const db = request.env.DB;
    const env2 = request.env;
    const { id } = request.params;
    try {
      const body = await request.json();
      const {
        tag,
        title: title2,
        description,
        image,
        video,
        video_2,
        video_3,
        video_text,
        video_2_text,
        video_3_text,
        buttonPrimaryText,
        buttonPrimaryLink,
        buttonSecondaryText,
        buttonSecondaryLink,
        sortOrder,
        isActive,
        tag_ar,
        title_ar,
        description_ar,
        video_ar,
        video_2_ar,
        video_3_ar,
        video_text_ar,
        video_2_text_ar,
        video_3_text_ar,
        buttonPrimaryText_ar,
        buttonSecondaryText_ar
      } = body;
      await db.prepare(`
          UPDATE hero_slides SET
            tag=?, title=?, description=?, image=?, video=?, video_2=?, video_3=?,
            video_text=?, video_2_text=?, video_3_text=?,
            buttonPrimaryText=?, buttonPrimaryLink=?, buttonSecondaryText=?, buttonSecondaryLink=?,
            sortOrder=?, isActive=?,
            tag_ar=?, title_ar=?, description_ar=?, video_ar=?, video_2_ar=?, video_3_ar=?,
            video_text_ar=?, video_2_text_ar=?, video_3_text_ar=?,
            buttonPrimaryText_ar=?, buttonSecondaryText_ar=?,
            updatedAt=CURRENT_TIMESTAMP
          WHERE id=?
        `).bind(
        tag,
        title2,
        description,
        image,
        video,
        video_2,
        video_3,
        video_text,
        video_2_text,
        video_3_text,
        buttonPrimaryText,
        buttonPrimaryLink,
        buttonSecondaryText,
        buttonSecondaryLink,
        sortOrder,
        isActive,
        tag_ar,
        title_ar,
        description_ar,
        video_ar,
        video_2_ar,
        video_3_ar,
        video_text_ar,
        video_2_text_ar,
        video_3_text_ar,
        buttonPrimaryText_ar,
        buttonSecondaryText_ar,
        id
      ).run();
      await deleteCached(CACHE_KEYS.slides, env2);
      const updated = await db.prepare("SELECT * FROM hero_slides WHERE id = ?").bind(id).first();
      return addCorsHeaders((0, import_itty_router_extras4.json)(parseSlideData(updated)), request.corsHeaders);
    } catch (err) {
      console.error("Error updating slide:", err);
      return addCorsHeaders((0, import_itty_router_extras4.error)(500, "Server error"), request.corsHeaders);
    }
  },
  async delete(request) {
    const db = request.env.DB;
    const env2 = request.env;
    const { id } = request.params;
    try {
      await db.prepare("DELETE FROM hero_slides WHERE id = ?").bind(id).run();
      await deleteCached(CACHE_KEYS.slides, env2);
      return addCorsHeaders((0, import_itty_router_extras4.json)({ success: true }), request.corsHeaders);
    } catch (err) {
      console.error("Error deleting slide:", err);
      return addCorsHeaders((0, import_itty_router_extras4.error)(500, "Server error"), request.corsHeaders);
    }
  }
};
function parseSlideData(slide) {
  return slide;
}
__name(parseSlideData, "parseSlideData");

// src/routes/services.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_itty_router_extras5 = __toESM(require_itty_router_extras(), 1);
var services_default = {
  async getAll(request) {
    const db = request.env.DB;
    const env2 = request.env;
    try {
      const cached = await getCached(CACHE_KEYS.services, env2);
      if (cached) {
        return addCorsHeaders(
          (0, import_itty_router_extras5.json)(cached, { headers: getCacheHeaders(CACHE_TTL.services) }),
          request.corsHeaders
        );
      }
      const services = await db.prepare("SELECT * FROM services ORDER BY sortOrder ASC").all();
      const data = services.results || [];
      await setCached(CACHE_KEYS.services, data, env2, CACHE_TTL.services);
      return addCorsHeaders(
        (0, import_itty_router_extras5.json)(data, { headers: getCacheHeaders(CACHE_TTL.services) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error("Error fetching services:", err);
      return addCorsHeaders((0, import_itty_router_extras5.error)(500, "Server error"), request.corsHeaders);
    }
  },
  async getActive(request) {
    const db = request.env.DB;
    try {
      const services = await db.prepare("SELECT * FROM services WHERE isActive = 1 ORDER BY sortOrder ASC").all();
      const data = services.results || [];
      return addCorsHeaders(
        (0, import_itty_router_extras5.json)(data, { headers: getCacheHeaders(CACHE_TTL.services) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error("Error fetching active services:", err);
      return addCorsHeaders((0, import_itty_router_extras5.error)(500, "Server error"), request.corsHeaders);
    }
  },
  async create(request) {
    const db = request.env.DB;
    const env2 = request.env;
    try {
      const body = await request.json();
      const { title: title2, description, icon, sortOrder, isActive, title_ar, description_ar } = body;
      const result = await db.prepare(`
          INSERT INTO services (title, description, icon, sortOrder, isActive, title_ar, description_ar)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(title2, description, icon, sortOrder || 0, isActive !== void 0 ? isActive : 1, title_ar, description_ar).run();
      await deleteCached(CACHE_KEYS.services, env2);
      const newService = await db.prepare("SELECT * FROM services WHERE id = ?").bind(result.meta.last_row_id).first();
      return addCorsHeaders((0, import_itty_router_extras5.json)(newService), request.corsHeaders);
    } catch (err) {
      console.error("Error creating service:", err);
      return addCorsHeaders((0, import_itty_router_extras5.error)(500, "Server error"), request.corsHeaders);
    }
  },
  async update(request) {
    const db = request.env.DB;
    const env2 = request.env;
    const { id } = request.params;
    try {
      const body = await request.json();
      const { title: title2, description, icon, sortOrder, isActive, title_ar, description_ar } = body;
      await db.prepare(`
          UPDATE services SET
            title=?, description=?, icon=?, sortOrder=?, isActive=?, title_ar=?, description_ar=?,
            updatedAt=CURRENT_TIMESTAMP
          WHERE id=?
        `).bind(title2, description, icon, sortOrder, isActive, title_ar, description_ar, id).run();
      await deleteCached(CACHE_KEYS.services, env2);
      const updated = await db.prepare("SELECT * FROM services WHERE id = ?").bind(id).first();
      return addCorsHeaders((0, import_itty_router_extras5.json)(updated), request.corsHeaders);
    } catch (err) {
      console.error("Error updating service:", err);
      return addCorsHeaders((0, import_itty_router_extras5.error)(500, "Server error"), request.corsHeaders);
    }
  },
  async delete(request) {
    const db = request.env.DB;
    const env2 = request.env;
    const { id } = request.params;
    try {
      await db.prepare("DELETE FROM services WHERE id = ?").bind(id).run();
      await deleteCached(CACHE_KEYS.services, env2);
      return addCorsHeaders((0, import_itty_router_extras5.json)({ success: true }), request.corsHeaders);
    } catch (err) {
      console.error("Error deleting service:", err);
      return addCorsHeaders((0, import_itty_router_extras5.error)(500, "Server error"), request.corsHeaders);
    }
  }
};

// src/routes/settings.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_itty_router_extras6 = __toESM(require_itty_router_extras(), 1);
var settings_default = {
  async getAll(request) {
    const db = request.env.DB;
    const env2 = request.env;
    try {
      const cached = await getCached(CACHE_KEYS.settings, env2);
      if (cached) {
        return addCorsHeaders(
          (0, import_itty_router_extras6.json)(cached, { headers: getCacheHeaders(CACHE_TTL.settings) }),
          request.corsHeaders
        );
      }
      const settings = await db.prepare("SELECT key, value FROM settings").all();
      const result = {};
      (settings.results || []).forEach((s2) => {
        result[s2.key] = s2.value;
      });
      await setCached(CACHE_KEYS.settings, result, env2, CACHE_TTL.settings);
      return addCorsHeaders(
        (0, import_itty_router_extras6.json)(result, { headers: getCacheHeaders(CACHE_TTL.settings) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error("Error fetching settings:", err);
      return addCorsHeaders((0, import_itty_router_extras6.error)(500, "Server error"), request.corsHeaders);
    }
  },
  async update(request) {
    const db = request.env.DB;
    const env2 = request.env;
    try {
      const body = await request.json();
      for (const [key, value] of Object.entries(body)) {
        await db.prepare("INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)").bind(key, value).run();
      }
      await deleteCached(CACHE_KEYS.settings, env2);
      return addCorsHeaders((0, import_itty_router_extras6.json)({ success: true }), request.corsHeaders);
    } catch (err) {
      console.error("Error updating settings:", err);
      return addCorsHeaders((0, import_itty_router_extras6.error)(500, "Server error"), request.corsHeaders);
    }
  }
};

// src/routes/auth.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_itty_router_extras7 = __toESM(require_itty_router_extras(), 1);
var ADMIN_USER = {
  id: 1,
  username: "admin",
  email: "admin@trq.design",
  passwordHash: "hashed_password_here"
  // Use bcrypt in production
};
var auth_default = {
  async login(request) {
    try {
      const body = await request.json();
      const { username, password } = body;
      if (username === "admin" && password === "trq2026") {
        const accessToken = generateToken(
          { id: ADMIN_USER.id, username: ADMIN_USER.username, email: ADMIN_USER.email },
          request.env.JWT_SECRET,
          3600
          // 1 hour
        );
        const refreshToken = generateToken(
          { id: ADMIN_USER.id, username: ADMIN_USER.username },
          request.env.JWT_SECRET,
          604800
          // 7 days
        );
        return addCorsHeaders(
          (0, import_itty_router_extras7.json)({
            success: true,
            accessToken,
            refreshToken,
            expiresIn: 3600,
            user: {
              id: ADMIN_USER.id,
              username: ADMIN_USER.username,
              email: ADMIN_USER.email
            }
          }),
          request.corsHeaders
        );
      }
      return addCorsHeaders(
        (0, import_itty_router_extras7.error)(401, "Invalid credentials"),
        request.corsHeaders
      );
    } catch (err) {
      console.error("Login error:", err);
      return addCorsHeaders(
        (0, import_itty_router_extras7.error)(500, "Server error"),
        request.corsHeaders
      );
    }
  },
  async refresh(request) {
    try {
      const body = await request.json();
      const { refreshToken } = body;
      if (!refreshToken) {
        return addCorsHeaders(
          (0, import_itty_router_extras7.error)(401, "Refresh token required"),
          request.corsHeaders
        );
      }
      const accessToken = generateToken(
        { id: ADMIN_USER.id, username: ADMIN_USER.username, email: ADMIN_USER.email },
        request.env.JWT_SECRET,
        3600
      );
      return addCorsHeaders(
        (0, import_itty_router_extras7.json)({
          success: true,
          accessToken,
          expiresIn: 3600
        }),
        request.corsHeaders
      );
    } catch (err) {
      console.error("Refresh error:", err);
      return addCorsHeaders(
        (0, import_itty_router_extras7.error)(500, "Server error"),
        request.corsHeaders
      );
    }
  },
  async verify(request) {
    return addCorsHeaders(
      (0, import_itty_router_extras7.json)({
        success: true,
        user: {
          id: request.user.id,
          username: request.user.username
        }
      }),
      request.corsHeaders
    );
  }
};

// src/routes/uploads.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_itty_router_extras8 = __toESM(require_itty_router_extras(), 1);
var uploads_default = {
  async upload(request) {
    try {
      const formData = await request.formData();
      const file = formData.get("file");
      if (!file) {
        return addCorsHeaders(
          (0, import_itty_router_extras8.error)(400, "No file provided"),
          request.corsHeaders
        );
      }
      if (file.size > 100 * 1024 * 1024) {
        return addCorsHeaders(
          (0, import_itty_router_extras8.error)(413, "File too large"),
          request.corsHeaders
        );
      }
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const filename = `${timestamp}-${random}-${file.name}`;
      const publicUrl = `https://media.trq.design/${filename}`;
      return addCorsHeaders(
        (0, import_itty_router_extras8.json)({
          success: true,
          filename,
          url: publicUrl,
          size: file.size,
          mimetype: file.type
        }),
        request.corsHeaders
      );
    } catch (err) {
      console.error("Upload error:", err);
      return addCorsHeaders(
        (0, import_itty_router_extras8.error)(500, "Upload failed"),
        request.corsHeaders
      );
    }
  },
  async delete(request) {
    try {
      const { filename } = request.params;
      if (!filename || filename.includes("..") || filename.includes("/")) {
        return addCorsHeaders(
          (0, import_itty_router_extras8.error)(400, "Invalid filename"),
          request.corsHeaders
        );
      }
      return addCorsHeaders(
        (0, import_itty_router_extras8.json)({ success: true }),
        request.corsHeaders
      );
    } catch (err) {
      console.error("Delete error:", err);
      return addCorsHeaders(
        (0, import_itty_router_extras8.error)(500, "Delete failed"),
        request.corsHeaders
      );
    }
  }
};

// src/worker.js
var router = e();
router.all("*", handleCors);
router.all("*", rateLimitMiddleware);
router.get("/api/health", () => (0, import_itty_router_extras9.json)({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() }));
router.get("/api/projects", projects_default.getAll);
router.get("/api/projects/published", projects_default.getPublished);
router.get("/api/projects/:id", projects_default.getById);
router.get("/api/slides", slides_default.getAll);
router.get("/api/slides/active", slides_default.getActive);
router.get("/api/services", services_default.getAll);
router.get("/api/services/active", services_default.getActive);
router.get("/api/settings", settings_default.getAll);
router.post("/api/auth/login", auth_default.login);
router.post("/api/auth/refresh", auth_default.refresh);
router.get("/api/auth/verify", authenticateToken, auth_default.verify);
router.post("/api/projects", authenticateToken, projects_default.create);
router.put("/api/projects/:id", authenticateToken, projects_default.update);
router.delete("/api/projects/:id", authenticateToken, projects_default.delete);
router.post("/api/slides", authenticateToken, slides_default.create);
router.put("/api/slides/:id", authenticateToken, slides_default.update);
router.delete("/api/slides/:id", authenticateToken, slides_default.delete);
router.post("/api/services", authenticateToken, services_default.create);
router.put("/api/services/:id", authenticateToken, services_default.update);
router.delete("/api/services/:id", authenticateToken, services_default.delete);
router.put("/api/settings", authenticateToken, settings_default.update);
router.post("/api/upload", authenticateToken, uploads_default.upload);
router.delete("/api/upload/:filename", authenticateToken, uploads_default.delete);
router.all("*", () => (0, import_itty_router_extras9.error)(404, "Not Found"));
var worker_default = {
  async fetch(request, env2, ctx) {
    try {
      request.env = env2;
      request.ctx = ctx;
      const response = await router.handle(request, env2, ctx);
      return response || (0, import_itty_router_extras9.error)(404, "Not Found");
    } catch (err) {
      console.error("Worker error:", err);
      return (0, import_itty_router_extras9.error)(500, "Internal Server Error");
    }
  },
  async scheduled(event, env2, ctx) {
    console.log("Running scheduled cache refresh...");
    try {
      await ctx.waitUntil(refreshCacheTask(env2));
    } catch (err) {
      console.error("Scheduled task error:", err);
    }
  }
};
async function refreshCacheTask(env2) {
  const cacheKeys = ["settings", "services", "slides"];
  for (const key of cacheKeys) {
    await env2.CACHE.delete(key);
  }
  console.log("Cache refresh complete");
}
__name(refreshCacheTask, "refreshCacheTask");

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e2) {
      console.error("Failed to drain the unused request body.", e2);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e2) {
    const error3 = reduceError(e2);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-4GY1Tb/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-4GY1Tb/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
