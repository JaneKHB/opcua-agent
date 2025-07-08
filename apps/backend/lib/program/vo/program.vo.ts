
// import { Types } from '@/backend/common/types'
// import ArrayType from 'ref-array-napi'
// import StructType from 'ref-struct-napi'

// export class ProgramVO {
//   static _Date = StructType({
//     year: Types.short,
//     month: Types.short,
//     day: Types.short,
//     hour: Types.short,
//     minute: Types.short,
//     dummy: Types.short,
//   })

//   static PRGDIR3 = StructType({
//     number: Types.int,
//     length: Types.int,
//     page: Types.int,
//     comment: ArrayType(Types.char, 52),
//     mdate: this._Date,
//     cdate: this._Date,
//   })

//   static IDBPDFADIR = StructType({
//     path: ArrayType(Types.char, 212),
//     req_num: Types.short,
//     size_kind: Types.short,
//     type: Types.short,
//     dummy: Types.short,
//   })

//   static IDBPDFSDIR = StructType({
//     path: ArrayType(Types.char, 212),
//     req_num: Types.short,
//     size_kind: Types.short,
//     dummy: Types.short,
//   })


//   static ODBPDFADIR = StructType({
//     data_kind: Types.short,
//     year: Types.short,
//     mon: Types.short,
//     day: Types.short,
//     hour: Types.short,
//     min: Types.short,
//     sec: Types.short,
//     dummy: Types.short,
//     dummy2: Types.int,
//     size: Types.int,
//     attr: Types.uint,
//     d_f: ArrayType(Types.char, 36),
//     comment: ArrayType(Types.char, 52),
//     o_time: ArrayType(Types.char, 12),
//   })

//   static ODBPDFSDIR = StructType({
//     sub_exist: Types.short,
//     dummy: Types.short,
//     d_f: ArrayType(Types.char, 36),
//   })

// }
