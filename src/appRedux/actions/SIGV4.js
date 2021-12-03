
import {
  SORTERS
} from "../../constants/ActionTypes";


export const getParams = (sorter, filter) => {
    let other = '';
    if (sorter && sorter.column) {
      other = other + `&sortField=${SORTERS[sorter.column.title]}`;
      other = other + `&sortValue=${sorter.order === "ascend" ? 'ASC' : 'DESC'}`;
    }
    
    if (filter) {
      if (filter.category) {
        filter.category.forEach((c) => {
          other = other + `&licenseCategory=${c}`
        })
      }

      if (filter.status) {
        filter.status.forEach((c) => {
          other = other + `&licenseStatus=${c}`
        })
      }
    }

    return other;
  }