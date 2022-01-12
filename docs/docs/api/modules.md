---
id: "modules"
title: "dstack-js"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Interfaces

- [Stack](interfaces/Stack)
- [StackOptions](interfaces/StackOptions)

## Type aliases

### ExecuteArguments

Ƭ **ExecuteArguments**: `Omit`<`GraphQLArgs`, ``"schema"``\>

#### Defined in

[index.ts:11](https://github.com/0x77dev/dstack/blob/539beea/packages/lib/src/index.ts#L11)

## Variables

### cid

• **cid**: `GraphQLScalarType`

#### Defined in

[schema/scalars.ts:4](https://github.com/0x77dev/dstack/blob/539beea/packages/lib/src/schema/scalars.ts#L4)

## Functions

### createStack

▸ `Const` **createStack**(`options`): `Promise`<[`Stack`](interfaces/Stack)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`StackOptions`](interfaces/StackOptions)<`any`\> |

#### Returns

`Promise`<[`Stack`](interfaces/Stack)\>

#### Defined in

[index.ts:22](https://github.com/0x77dev/dstack/blob/539beea/packages/lib/src/index.ts#L22)

___

### put

▸ `Const` **put**(`ipfs`, `directiveName?`): `Object`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `ipfs` | `IPFS`<{}\> | `undefined` |
| `directiveName` | `string` | `'put'` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `transformer` | (`schema`: `GraphQLSchema`) => `GraphQLSchema` |
| `typeDefs` | `string` |

#### Defined in

[schema/directives.ts:6](https://github.com/0x77dev/dstack/blob/539beea/packages/lib/src/schema/directives.ts#L6)

___

### resolveRecord

▸ `Const` **resolveRecord**(`ipfs`, `record`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ipfs` | `IPFS`<{}\> |
| `record` | `Record`<`string`, `unknown`\> |

#### Returns

`Promise`<`any`\>

#### Defined in

[schema/transform.ts:44](https://github.com/0x77dev/dstack/blob/539beea/packages/lib/src/schema/transform.ts#L44)

___

### transformField

▸ `Const` **transformField**(`field`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `unknown` |

#### Returns

`any`

#### Defined in

[schema/transform.ts:20](https://github.com/0x77dev/dstack/blob/539beea/packages/lib/src/schema/transform.ts#L20)

___

### transformRecord

▸ `Const` **transformRecord**(`record`, `ignoreCID?`): `Record`<`string`, `any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `record` | `Record`<`string`, `any`\> | `undefined` |
| `ignoreCID` | `boolean` | `true` |

#### Returns

`Record`<`string`, `any`\>

#### Defined in

[schema/transform.ts:33](https://github.com/0x77dev/dstack/blob/539beea/packages/lib/src/schema/transform.ts#L33)
