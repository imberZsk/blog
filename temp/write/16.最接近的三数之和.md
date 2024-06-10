/*
 * @lc app=leetcode.cn id=16 lang=javascript
 *
 * [16] 最接近的三数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function (nums, target) {
  // 先排序
  // 双指针朝中间走 -> <-
  let length = nums.length

  // 最大的值
  let res = Number.MAX_SAFE_INTEGER

  nums.sort((a, b) => a - b)
  for (let i = 0; i < nums.length; i++) {
    // nums[i] + nums[i+1] + nums[length-1] = target;
    let left = i + 1
    let right = length - 1

    // 直到两个指针相等
    while (left < right) {
      let sum = nums[i] + nums[left] + nums[right]
      if (Math.abs(sum - target) < Math.abs(res - target)) {
        res = sum
      }

      // 大了右指针左移动
      if (sum > target) {
        right--
      }

      // 笑了左指针右移动
      if (sum < target) {
        left++
      }

      if (sum === target) {
        // 因为这个数组是排序的，如果相等，那么就直接返回，不用继续遍历了。
        return sum
      }
    }
  }
  return res
}
// @lc code=end
