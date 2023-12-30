package cc.elefteria.cryfteriaback.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class CryfteriaEntityNotFoundException extends RuntimeException{
  public CryfteriaEntityNotFoundException(String message) {
    super(message);
  }
}
