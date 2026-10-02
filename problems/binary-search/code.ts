import { defineCode, type Implementations } from "@/core/algorithm/languages";

/** Same anchors as the Binary Search concept (the problem reuses its trace); only the array is called nums. */
export const languages: Implementations = {
  java: defineCode(`static int search(int[] nums, int target) {
    int low = 0;                            //@low
    int high = nums.length - 1;             //@high
    while (low <= high) {                   //@loop
        int mid = low + (high - low) / 2;   //@mid
        if (nums[mid] == target) {          //@equal
            return mid;                     //@found
        } else if (nums[mid] < target) {    //@less
            low = mid + 1;                  //@go-right
        } else {
            high = mid - 1;                 //@go-left
        }
    }
    return -1;                              //@not-found
}`),
  python: defineCode(`def search(nums, target):
    low = 0                         #@low
    high = len(nums) - 1            #@high
    while low <= high:              #@loop
        mid = (low + high) // 2     #@mid
        if nums[mid] == target:     #@equal
            return mid              #@found
        elif nums[mid] < target:    #@less
            low = mid + 1           #@go-right
        else:
            high = mid - 1          #@go-left
    return -1                       #@not-found`),
};
