import NiiHeader from "./NiiHeader";

class Nii {

  //header properties
  constructor() {
    this.littleEndian = true;
    this.header = new NiiHeader();
    this.bitmap;
    this.arrayBuffer;
  }


  writeNiiHeader(data, dtype, affine) {
    const header = new DataView(new ArrayBuffer(348));
    return header;
  }

  //to do for general
  /*writeNii(data, dtype, affine){
		if (typeof(dtype) === "undefined") {
			dtype = 2;
		}
		if (typeof(affine) === "undefined") {
			affine = [];
		}

		const header = this.writeNiiHeader(data, dtype, affine);

		let bitmap;
		const bitmap_size = 30*1024*1024;
		switch (dtype) {
			case 2:
				bitmap = new Uint8Array(bitmap_size);
				break;
			case 256:
				bitmap = new Int8Array(bitmap_size);
				break;
		}
		// serialize data to bitmap in Nifti format

		// is this the good way?
		return header.concat(bitmap);
	}*/

  readNii(arrayBuffer, needReverse) {
    //this.ds_hdrname = blob.name;
    //this.ds_datname = blob.name;
    this.arrayBuffer = arrayBuffer;
    let data = new DataView(arrayBuffer);
    this.header.sizeof_hdr = data.getInt16(0, this.littleEndian);
    this.header.session_error = data.getInt16(38, this.littleEndian);
    for (i = 0; i < 8; i++) {
      this.header.dim[i] = data.getInt16(40 + i * 2, this.littleEndian);
      switch (i) {
        case 1:
          this.header.width = data.getInt16(40 + i * 2, this.littleEndian);
          break;
        case 2:
          this.header.height = data.getInt16(40 + i * 2, this.littleEndian);
          break;
        case 3:
          this.header.num_frames = data.getInt16(40 + i * 2, this.littleEndian);
          break;
      }
    }
    for (var i = 0; i < 3; i++) {
      this.header.intent[i] = data.getFloat32(56 + i * 4, this.littleEndian);
    }
    this.header.intent_code = data.getInt16(68, this.littleEndian);
    this.header.datatype = data.getInt16(70, this.littleEndian);
    this.header.bitpix = data.getInt16(72, this.littleEndian);
    this.header.slice_start = data.getInt16(74, this.littleEndian);
    for (i = 0; i < 8; i++) {
      this.header.pixdim[i] = data.getFloat32(76 + i * 4, this.littleEndian);
    }
    this.header.qfac = this.header.pixdim[0];
    this.header.vox_offset = data.getFloat32(108, this.littleEndian);
    this.header.scl_slope = data.getFloat32(112, this.littleEndian);
    this.header.scl_inter = data.getFloat32(116, this.littleEndian);
    this.header.slice_end = data.getInt16(120, this.littleEndian);
    this.header.slice_code = data.getInt8(122, this.littleEndian);
    this.header.xyzt_units = data.getInt8(123, this.littleEndian);
    this.header.cal_max = data.getFloat32(124, this.littleEndian);
    this.header.cal_min = data.getFloat32(128, this.littleEndian);
    this.header.slice_duration = data.getFloat32(132, this.littleEndian);
    this.header.toffset = data.getFloat32(136, this.littleEndian);
    this.header.glmax = data.getInt32(140, this.littleEndian);
    this.header.glmin = data.getInt32(144, this.littleEndian);
    this.header.qform_code = data.getInt16(252, this.littleEndian);
    this.header.sform_code = data.getInt16(254, this.littleEndian);
    for (i = 0; i < 3; i++) {
      this.header.quatern[i] = data.getFloat32(256 + i * 4, this.littleEndian);
    }
    for (i = 0; i < 3; i++) {
      this.header.qoffset[i] = data.getFloat32(268 + i * 4, this.littleEndian);
    }
    for (i = 0; i < 4; i++) {
      this.header.srow_x[i] = data.getFloat32(280 + i * 4, this.littleEndian);
    }
    for (i = 0; i < 4; i++) {
      this.header.srow_y[i] = data.getFloat32(296 + i * 4, this.littleEndian);
    }
    for (i = 0; i < 4; i++) {
      this.header.srow_z[i] = data.getFloat32(312 + i * 4, this.littleEndian);
    }
    this.readNiiData(arrayBuffer, needReverse);
  }

  readNiiData(arrayBuffer, needReverse) {
    if (this.header.vox_offset == undefined || this.header.dim == undefined) {
      throw "file not init";
    }
    // const numFrame = 3;
    // this.data = new Array(numFrame);
    // for(var n = 0; n < numFrame; n++){
    // 	const pixelData = this.data[n] = new Uint8Array[10*10];
    // }
    var needReturn = [];
    const arrayLength = this.header.dim[1] * this.header.dim[2];
    for (var i = 0; i < this.header.dim[3]; i++) {
      needReturn[i] = new Uint8Array(
        arrayBuffer,
        this.header.vox_offset + arrayLength * i,
        arrayLength
      );
    }
    if (needReverse) {
      this.bitmap = needReturn.reverse();
    } else {
      this.bitmap = needReturn;
    }
    //
  }

  modifyNiiData(uint8array, frame) {
    let fileuint8array = new Uint8Array(this.arrayBuffer);
    fileuint8array.set(
      uint8array,
      this.header.vox_offset + frame * this.header.width * this.header.height
    );
    this.readNiiData(fileuint8array.buffer);
    return fileuint8array;
  }

  writeNiiData(bitmap, isFrameNumChange = false) {
    //not totally test for isFrameNumChange true case
    if (isFrameNumChange) {
      let header = new Uint8Array(
        this.arrayBuffer.slice(0, this.header.vox_offset)
      );
      let uint8arrayLength = this.header.vox_offset;
      //calculate for file byte length
      for (var i in bitmap) {
        uint8arrayLength += bitmap[i].byteLength;
      }
      let fileuint8array = new Uint8Array(uint8arrayLength);
      fileuint8array.set(header, 0);
      for (var i in bitmap) {
        fileuint8array.set(
          bitmap[i],
          this.header.vox_offset + i * this.header.width * this.header.height
        );
      }
      this.header.dim[3] = bitmap.length;
      this.header.num_frames = bitmap.length;
      fileuint8array[46] = bitmap.length;
      this.readNiiData(fileuint8array.buffer);
      //   this.saveFiletoLocal(fileuint8array);
      return fileuint8array;
    } else {
      let fileuint8array = new Uint8Array(this.arrayBuffer);
      for (var i in bitmap) {
        fileuint8array.set(
          bitmap[i],
          this.header.vox_offset + i * this.header.width * this.header.height
        );
      }
      this.readNiiData(fileuint8array.buffer);
      //   this.saveFiletoLocal(fileuint8array);
      return fileuint8array;
    }
  }
  saveFiletoLocal(fileuint8array) {
    var saveByteArray = (function() {
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      return function(data, name) {
        var blob = new Blob(data, { type: "octet/stream" }),
          url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
      };
    })();
    saveByteArray([fileuint8array], "example.nii");
  }
}
export default Nii;
