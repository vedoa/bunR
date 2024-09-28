library(minpack.lm)

customRFunction <- function(y, t){
    out <- nlsLM(
        data = data.frame(y = y, t = t),
        start = list(x1 = 2.50, x2 = 0.25),
        formula = y ~ x1*exp(x2*t)
    )
    coef(out)
}