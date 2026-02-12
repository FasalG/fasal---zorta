import { serialize } from 'object-to-formdata';

export function GetFormData(data: any) {
  return serialize(data, {
    indices: true,
  });
}



