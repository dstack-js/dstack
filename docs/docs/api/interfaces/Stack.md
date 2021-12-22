---
id: "Stack"
title: "Interface: Stack"
sidebar_label: "Stack"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### context

• **context**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ipfs` | `IPFS`<{}\> |

#### Defined in

[index.ts:16](https://github.com/0x77dev/dstack/blob/539beea/packages/lib/src/index.ts#L16)

___

### schema

• **schema**: `GraphQLSchema`

#### Defined in

[index.ts:14](https://github.com/0x77dev/dstack/blob/539beea/packages/lib/src/index.ts#L14)

## Methods

### execute

▸ **execute**(`arguments_`): `Promise`<`ExecutionResult`<`ObjMap`<`unknown`\>, `ObjMap`<`unknown`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arguments_` | [`ExecuteArguments`](../modules#executearguments) |

#### Returns

`Promise`<`ExecutionResult`<`ObjMap`<`unknown`\>, `ObjMap`<`unknown`\>\>\>

#### Defined in

[index.ts:15](https://github.com/0x77dev/dstack/blob/539beea/packages/lib/src/index.ts#L15)

___

### stop

▸ **stop**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:19](https://github.com/0x77dev/dstack/blob/539beea/packages/lib/src/index.ts#L19)
