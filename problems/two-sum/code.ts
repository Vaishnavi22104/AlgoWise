import { defineCode, type Implementations } from "@/core/algorithm/languages";

export const languages: Implementations = {
  java: defineCode(`static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();     //@seen
    for (int i = 0; i < nums.length; i++) {           //@loop
        int need = target - nums[i];                  //@need
        if (seen.containsKey(need)) {                 //@lookup
            return new int[] { seen.get(need), i };   //@found
        }
        seen.put(nums[i], i);                         //@store
    }
    return new int[] {};                              //@not-found
}`),
  python: defineCode(`def two_sum(nums, target):
    seen = {}                       #@seen
    for i, x in enumerate(nums):    #@loop
        need = target - x           #@need
        if need in seen:            #@lookup
            return [seen[need], i]  #@found
        seen[x] = i                 #@store
    return []                       #@not-found`),
};
