import {
  ToolClientAuthStrategy,
  ToolClientElementBaseType,
  ToolClientHTMLElementType,
  ToolClientMethod,
  ToolClientRequestContentType,
  ToolClientRequestTarget,
  ToolClientResponseContentType,
  ToolClientResponseTarget,
} from "./types";

export interface ToolClientElement {
  label: string;
  description?: string;
  htmlElementType: ToolClientHTMLElementType;
  valueType: ToolClientElementBaseType;
}

export interface ToolClientRequest {
  id: string;
  type: ToolClientRequestTarget;
  required: boolean;
  key: string;
  valueType: ToolClientElementBaseType;
  bindedElementType: ToolClientElement;
}

export interface ToolClientResponse {
  id: string;
  type: ToolClientResponseTarget;
  key: string;
  valueType: ToolClientElementBaseType;
  bindedElementType: ToolClientElement;
}

export interface ToolProviderInterface {
  url: string;
  authStrategy: ToolClientAuthStrategy;
  requestMethod: ToolClientMethod;
  requestContentType: ToolClientRequestContentType;
  responseContentType: ToolClientResponseContentType;
  requestInterface: ToolClientRequest[];
  responseInterface: ToolClientResponse[];
}

export interface Tool {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  provider_interface: ToolProviderInterface;
}

export interface CreateToolDTO {
  name: string;
  description?: string;
  image_url?: string;
  provider_interface: ToolProviderInterface;
}
