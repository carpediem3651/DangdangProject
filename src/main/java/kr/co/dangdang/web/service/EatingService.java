package kr.co.dangdang.web.service;

import java.util.List;

import kr.co.dangdang.web.entity.Eating;
import kr.co.dangdang.web.entity.EatingView;
import kr.co.dangdang.web.entity.MealCategoryView;

public interface EatingService {

	List<EatingView> getEatingDataByDate(Long memberId, String selectedDate);

	Eating reg(String selectedDate, Long memberId, Long productId, Integer mealCategoryId);

	MealCategoryView getByMealCategory(Integer mealCategoryId, String eatingDate, Long memberId);

	List<EatingView> getListByMealCategory(Long memberId, String eatingDate, Integer mealCategoryId);

}
