import { Resource, ResourceTemplate, Tool } from "@modelcontextprotocol/sdk/types.js";
import { createToolResponse, createUIToolResponse } from "../utils/utils.js";
import { ResourceHandlers, ToolHandlers } from '../utils/types.js';
import { log } from "../utils/common/logging.js";

type PizzazWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  responseText: string;
};

const widgets: PizzazWidget[] = [
  {
    id: "pizza-map",
    title: "Show Pizza Map",
    templateUri: "ui://widget/pizza-map.html",
    invoking: "Hand-tossing a map",
    invoked: "Served a fresh map",
    html: `
      <!doctype html> <html> <head> 
      <script type="module" src="http://localhost:4444/todo-2d2b.js"></script> 
      <link rel="stylesheet" href="http://localhost:4444/todo-2d2b.css"> </head> <body> <div id="todo-root"></div> </body> </html>`,
    responseText: "Rendered a pizza map!",
  },
  {
    id: "solar-system",
    title: "Show Solar System",
    templateUri: "ui://widget/solar-system.html",
    invoking: "Hand-tossing a solar system",
    invoked: "Served a fresh solar system",
    html: `
      <!doctype html> <html> <head> 
      <script type="module" src="http://localhost:4444/solar-system-2d2b.js"></script> 
      <link rel="stylesheet" href="http://localhost:4444/solar-system-2d2b.css"> </head> <body> <div id="solar-system-root"></div> </body> </html>`,
    responseText: "Rendered a solar system!",
  },
  {
    id: "todo-list",
    title: "Show Todo List",
    templateUri: "ui://widget/todo-list.html",
    invoking: "Hand-tossing a todo list",
    invoked: "Served a fresh todo list",
    html: `
      <!doctype html> <html> <head> 
      <script type="module" src="http://localhost:4444/todo-list-2d2b.js"></script> 
      <link rel="stylesheet" href="http://localhost:4444/todo-list-2d2b.css"> </head> <body> <div id="todo-list-root"></div> </body> </html>`,
    responseText: "Rendered a todo list!",
  }
];

const widgetMeta = (widget: PizzazWidget) => (
  {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true,
  });


// Tool definitions
const GET_CALCULATOR: Tool = {
  name: 'get-calculator',
  description:
    'Get the result of a calculation based on the provided input',
  inputSchema: {
    type: 'object',
    properties: {
    },
  },
};

const toolInputSchema = {
  type: "object" as const,
  properties: {
    pizzaTopping: {
      type: "string",
      description: "Topping to mention when rendering the widget.",
    },
  },
  required: ["pizzaTopping"],
  additionalProperties: false,
};


// Widgets Tools definition
const WIDGETS_TOOLS: Tool[] = widgets.map((widget) => ({
  name: widget.id,
  description: widget.title,
  inputSchema: toolInputSchema,
  title: widget.title,
  _meta: widgetMeta(widget),
  // To disable the approval prompt for the widgets
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
}));


export const CALCULATOR_TOOLS = [
  GET_CALCULATOR,
  ...WIDGETS_TOOLS
];

export const CALCULATOR_RESOURCES: Resource[] = widgets.map((widget) => ({
  uri: widget.templateUri,
  name: widget.title,
  description: `${widget.title} widget markup`,
  mimeType: "text/html+skybridge",
  _meta: widgetMeta(widget),
}));

export const CALCULATOR_HANDLERS: ToolHandlers = {
  'get-calculator': async () => {
    const result = 42;
    return createToolResponse(result);
  },
  'pizza-map': async (request) => {
    log.info('Handling pizza-map widget tool request', request);

    const args = request.params.arguments ?? {}

    const widget = widgets.find((w) => w.id === 'pizza-map');
    if (!widget) {
      throw new Error('Widget not found');
    }
    return {
      content: [
        {
          type: "text",
          text: widget.responseText,
        },
      ],
      structuredContent: {
        pizzaTopping: args.pizzaTopping,
      },
      _meta: widgetMeta(widget),
    };
  }
};

export const CALCULATOR_RESOURCE_HANDLERS: ResourceHandlers =
  widgets.reduce((handlers, widget) => {
    handlers[widget.templateUri] = async () => {
      const uri = widget.templateUri;
      const text = widget.html;
      const meta = widgetMeta(widget);

      return createUIToolResponse({
        text, uri, meta
      });
    };
    return handlers;
  }, {} as ResourceHandlers);




export const CALCULATOR_RESOURCE_TEMPLATES: ResourceTemplate[] = widgets.map((widget) => ({
  uriTemplate: widget.templateUri,
  name: widget.title,
  description: `${widget.title} widget markup`,
  mimeType: "text/html+skybridge",
  _meta: widgetMeta(widget),
}));


// const widgetsById = new Map<string, PizzazWidget>();
// export const widgetsByUri = new Map<string, PizzazWidget>();

// widgets.forEach((widget) => {
//   widgetsById.set(widget.id, widget);
//   widgetsByUri.set(widget.templateUri, widget);
// });

