class NiiHeader {
    constructor() {
		this.ds_hdrname;	// file name for header
		this.ds_datname;	// file name for data
		this.ds_is_nii;	// does dataset use single file .nii 
		this.big_endian;	// does hdr appear to have BE format
		this.freq_dim;	// unpack dim_info
		this.phase_dim;
		this.slice_dim;  
		this.xyz_unit_code	// unpack xyzt_units;
		this.t_unit_code;	
		this.qfac;				// unpack pixdim[0]
		this.extensions_list;		// vector of size/code pairs for ext.
		this.extension_blobs;		// vector of extension data

		// variables for fields in the nifti header 
		this.sizeof_hdr;	// must be 348 bytes
		this.data_type_string;	// 10 char UNUSED
		this.db_name;	// 18 char UNUSED
		this.extents;	// UNUSED
		this.session_error;	// UNUSED
		this.regular;	// 1 char UNUSED
		this.dim_info;	// 1 char MRI slice ordering
		this.dim = [];		// data array dimensions (8 shorts)
		this.num_frames;    // number of frames
		this.width;         // width of frames
		this.height;        // height of frames
		this.intent = [];	// intents p1 p2 p3
		this.intent_code;	// nifti intent code for dataset
		this.datatype;	// datatype of image blob
		this.bitpix;		// #bits per voxel
		this.slice_start;	// first slice index
		this.pixdim = [];	// grid spacings
		this.vox_offset;	// offset to data blob in .nii file
		this.scl_slope;	// data scaling: slope
		this.scl_inter;	// data scaling: intercept
		this.slice_end;	// last slice index
		this.slice_code;	// slice timing order
		this.xyzt_units;	// units of pixdim[1-4]
		this.cal_max;	// max display intensity
		this.cal_min;	// min display intensity
		this.slice_duration;	// time to acq. 1 slice
		this.toffset;	// time axis shift
		this.glmax;		// UNUSED
		this.glmin;		// UNUSED
		this.descrip;	// 80 char any text you'd like (comment)
		this.aux_file;	// 24 char auxiliary file name
		this.qform_code;	// code for quat. transform
		this.sform_code;	// code for affine transform
		this.quatern = [];	// 3 floats Quaternion b,c,d params
		this.qoffset = [];	// 3 floats Quaternion x,y,z shift
		this.srow_x = [];	// 4 floats 1st row affine xform
		this.srow_y = [];	// 4 floats 2nd row affine xform
		this.srow_z = [];	// 4 floats 3rd row affine xform
		this.intent_name;	// 16 char name/meaning/id for data
		this.magic;		// 4 char id must be "ni1\0" or "n+1\0"
		this.extension = [];	// 4 byte array, byte 0 is 0/1 indicating extensions or not
    }
    writeNiiHeader(data, dtype, affine) {
	}
}
export default NiiHeader