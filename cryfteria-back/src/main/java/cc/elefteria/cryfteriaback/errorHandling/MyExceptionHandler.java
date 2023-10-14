package cc.elefteria.cryfteriaback.errorHandling;

import cc.elefteria.cryfteriaback.exception.MyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class MyExceptionHandler {
  @ExceptionHandler
  public ResponseEntity<String> myEntityErrorHandler(MyException e){
    return ResponseEntity.badRequest().body(e.getMessage());
  }

  @ExceptionHandler
  public ResponseEntity<String> myEntityErrorHandler(Exception e){
    return ResponseEntity.badRequest().body(e.getMessage());
  }
}
