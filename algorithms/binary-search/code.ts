import { defineCode, type Implementations } from "@/core/algorithm/languages";

export const languages: Implementations = {
  java: defineCode(`static int binarySearch(int[] arr, int target) {
    int low = 0;                            //@low
    int high = arr.length - 1;              //@high
    while (low <= high) {                   //@loop
        int mid = low + (high - low) / 2;   //@mid
        if (arr[mid] == target) {           //@equal
            return mid;                     //@found
        } else if (arr[mid] < target) {     //@less
            low = mid + 1;                  //@go-right
        } else {
            high = mid - 1;                 //@go-left
        }
    }
    return -1;                              //@not-found
}`),
  python: defineCode(`def binary_search(arr, target):
    low = 0                         #@low
    high = len(arr) - 1             #@high
    while low <= high:              #@loop
        mid = (low + high) // 2     #@mid
        if arr[mid] == target:      #@equal
            return mid              #@found
        elif arr[mid] < target:     #@less
            low = mid + 1           #@go-right
        else:
            high = mid - 1          #@go-left
    return -1                       #@not-found`),
};
