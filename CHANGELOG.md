# Changelog

## 0.2.0

### Breaking Changes

- The `endpointPath` option now properly propagates to the client-side plugin. If you were using a custom `endpointPath` in your plugin config, the client will now correctly call that path instead of the hardcoded `/ai-generate`.

### Features

- **Authentication check**: The AI generate endpoint now returns `401 Unauthorized` for unauthenticated requests.
- **Configurable endpoint path on client**: The `endpointPath` option is forwarded from the server feature to the client plugin, so custom paths work end-to-end.
- **Exported `AIGenerateClientProps` type** for consumers who need to type client-side props.

### Improvements

- Reuse the OpenAI client instance across requests instead of creating a new one per call.
- Use `max_completion_tokens` instead of the deprecated `max_tokens` parameter.
- Deduplicate toolbar button config between fixed and inline toolbars.
- Bump minimum `openai` dependency to `^4.47.0` (required for `max_completion_tokens` support).
- Bump dev dependencies: `@swc/cli` ^0.8.0, `@swc/core` ^1.15.0, `typescript` ^5.8.0.

## 0.1.1

- Updated readme and package metadata.

## 0.1.0

- Initial implementation of the AI text generation plugin for Payload CMS v3.
