import { defineCode, type Implementations } from "@/core/algorithm/languages";

/**
 * The code shown in the editor, one entry per language (Java is the default, Python is the second).
 * Put //@name (Java) or #@name (Python) at the end of every line a step can highlight. The markers are
 * removed from what learners see. Use the SAME names in both languages: executor.ts refers to them.
 */
export const languages: Implementations = {
  java: defineCode(`static int findMax(int[] arr) {
    int best = arr[0];              //@init
    for (int x : arr) {             //@loop
        if (x > best) {             //@compare
            best = x;               //@update
        }
    }
    return best;                    //@return
}`),
  python: defineCode(`def find_max(arr):
    best = arr[0]           #@init
    for x in arr:           #@loop
        if x > best:        #@compare
            best = x        #@update
    return best             #@return`),
};
