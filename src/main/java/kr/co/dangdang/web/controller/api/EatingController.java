package kr.co.dangdang.web.controller.api;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.dangdang.web.config.auth.DangdangUserDetails;
import kr.co.dangdang.web.entity.Eating;
import kr.co.dangdang.web.entity.EatingView;
import kr.co.dangdang.web.service.EatingService;

@RestController("apiEatingController")
@RequestMapping("/api/eatings")
public class EatingController {
	
    @Autowired
    private EatingService service;

    @GetMapping
    public List<EatingView> getEatingData(
    		@RequestParam(name = "selectedDate", required = true) String selectedDate) {
    	
    	Long memberId = memberId();
    	
    	System.out.print("selectedDate: ");
		System.out.println(selectedDate);
    	
    	List<EatingView> datas = service.getEatingDataByDate(memberId, selectedDate);
    	
		return datas;
    }
    
    @GetMapping({"todayDate"})
    public List<EatingView> getEatingTodayData(
    		){
    	
    	Long memberId = memberId();
    	
		LocalDate today = LocalDate.now();

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		String todayDate = today.format(formatter);
		
		List<EatingView> datas = service.getEatingDataByDate(memberId, todayDate);
    
		return datas;
    }
    
    @GetMapping("/findByMealCategory")
    public List<EatingView> getListByMealCategory(
            @RequestParam("eatingDate") String eatingDate,
            @RequestParam("mealCategoryId") Integer mealCategoryId
        ) {

    	Long memberId = memberId();
    	
    	List<EatingView> list = service.getListByMealCategory(memberId, eatingDate, mealCategoryId);
    	
        return list;
        }
    
	@PostMapping
	public Eating reg(
			@RequestBody Eating eating){
		
		Long memberId = memberId();
		
		String selectedDate = eating.getRegDate();
		Long productId = eating.getProductId();
		Integer mealCategoryId = eating.getMealCategoryId();
		
		Eating data = service.reg(selectedDate, memberId, productId, mealCategoryId);
		
		return data;
	}
	
	
	
	private Long memberId() {
		// TODO Auto-generated method stub
		DangdangUserDetails userDetails = 
				(DangdangUserDetails) SecurityContextHolder
											.getContext()
											.getAuthentication()
											.getPrincipal();

		Long memberId = userDetails.getId();
		
		return memberId;
	}		
}