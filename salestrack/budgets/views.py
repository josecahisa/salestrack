import io
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.core import serializers
from django.db import models
from django.contrib.auth.decorators import login_required
from django.http import FileResponse
from reportlab.pdfgen import canvas
from budgets.models import Budget, Shipping, PaymentTerm, BudgetDetail
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.pdfmetrics import stringWidth
from django.conf import settings
from PIL import Image
from reportlab.pdfbase import pdfmetrics
from enum import Enum
from reportlab.lib.colors import Color, black, blue, red
import locale
from urllib.parse import unquote
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet

locale.setlocale(locale.LC_ALL, 'es_AR.UTF-8')



DEBUG_PRINT_LEVEL = 0

A4_WIDTH = 590
A4_HEIGHT = 840

MAIN_RECT_W = 540
MAIN_RECT_H = 790
MAIN_RECT_X = 30
MAIN_RECT_Y = 30

HEADER_H = 150

HEADER_LINE_1 = 'Fábrica y Admin.: Av. San Martín 1666 (S2152EDQ) - G. Baigorria (Depto. Rosario) / Santa Fe / Argentina'
HEADER_LINE_2 = 'Teléfonos: (54) 341 4712020 - Fax:(54) 341 4710493'
HEADER_LINE_3 = 'Sede Buenos Aires: Ciudad de la Paz 151 - 8° 8 - (C1426AGA) C.A.B.A. Teléfono: (54) 11 45141212'
HEADER_LINE_EMAIL = 'ventas@argental.com.ar'
HEADER_LINE_WEB = 'www.argental.com.ar'
HEADER_LINE_CUIT = 'CUIT: 30-50256682-9'
HEADER_LINE_IVA = 'I.V.A. Responsable Inscripto'

class Alignment(Enum):
    LEFT = 1
    CENTER = 2
    RIGHT = 3

class Text_Style:
    def __init__(self, font_name, font_size, font_color):
        self.font_name = font_name
        self.font_size = font_size
        self.font_color = font_color
        self.font_height = self.get_font_height()

    def get_font_height(self):
        face = pdfmetrics.getFont(self.font_name).face
        ascent = (face.ascent * self.font_size) / 1000.0
        descent = (face.descent * self.font_size) / 1000.0
        height = ascent + abs(descent)
        return height

    def apply_style(self, pdf_object):
        # print("setting fill color for text = {0}".format(self.font_color))
        pdf_object.setFillColorRGB(
            self.font_color.red / 255,
            self.font_color.green / 255,
            self.font_color.blue / 255
        )
        # pdf_object.setStrokeColor(self.font_color)
        pdf_object.setFont(self.font_name, self.font_size)

class Point:
    def __init__(self, x, y, name='<unnamed>'):
        self.x = x
        self.y = y
        self.name = name

    def debug(self, indent=""):
        print("{0}Point {1} => x = {2} y = {3}".format(indent, self.name, self.x, self.y))

class InvalidRectangleCreation(Exception):
    pass

class Rectangle:
    # The rectangle has 2 points
    def __init__(self, *args, **kwargs):
        x = kwargs.get('x', 0)
        y = kwargs.get('y', 0)
        self.top_left_point = Point(x, y, "Top left point")
        self.__all_lines_visible = True
        self.__draw_top_line = False
        self.__draw_bottom_line = False
        self.__draw_left_line = False
        self.__draw_right_line = False
        self.line_width = 0.25

        if 'name' in kwargs:
            self.name = kwargs.get('name')
        else:
            self.name = '<unnamed>'

        if 'width' in kwargs and 'height' in kwargs:
            if 'x2' in kwargs or 'y2' in kwargs:
                raise InvalidRectangleCreation('Invalid x2 or y2 parameters received for rectangle creation')
        
            self.width = kwargs.get('width')
            self.height = kwargs.get('height')
        else:
            x2 = kwargs.get('x2')
            y2 = kwargs.get('y2')
            self.width = abs(x2 - x)
            self.height = abs(y2 - y)

        if 'draw_top_line' in kwargs:
            self.all_lines_visible = False
            self.draw_top_line = kwargs.get('draw_top_line')

        if 'draw_bottom_line' in kwargs:
            self.all_lines_visible = False
            self.draw_bottom_line = kwargs.get('draw_bottom_line')

        if 'draw_left_line' in kwargs:
            self.all_lines_visible = False
            self.draw_left_line = kwargs.get('draw_left_line')

        if 'draw_right_line' in kwargs:
            self.all_lines_visible = False
            self.draw_right_line = kwargs.get('draw_right_line')

        if 'line_width' in kwargs:
            self.line_width = kwargs.get('line_width')

        self.top_right_point = Point(
            self.top_left_point.x + self.width,
            self.top_left_point.y,
            "Top right point"
        )

        self.bottom_right_point = Point(
            self.top_left_point.x + self.width,
            self.top_left_point.y - self.height,
            "Bottom right point"
        )

        self.bottom_left_point = Point(
            self.top_left_point.x,
            self.bottom_right_point.y,
            "Bottom left point"
        )

        self.x_center = self.top_left_point.x + self.width / 2
        self.y_center = self.top_left_point.y - self.height / 2

        if 'back_ground_color' in kwargs:
            self.back_ground_color = kwargs.get('back_ground_color')
        else:
            self.back_ground_color = None

        self.print_level = kwargs.get('printlevel', 0)

    @property
    def draw_right_line(self):
        return self.__draw_right_line

    @draw_right_line.setter
    def draw_right_line(self, draw_right_line):
        self.__draw_right_line = draw_right_line
        self.__all_lines_visible = False

    @property
    def draw_top_line(self):
        return self.__draw_top_line

    @draw_top_line.setter
    def draw_top_line(self, draw_top_line):
        self.__draw_top_line = draw_top_line
        self.__all_lines_visible = False

    @property
    def draw_bottom_line(self):
        return self.__draw_bottom_line

    @draw_bottom_line.setter
    def draw_bottom_line(self, draw_bottom_line):
        self.__draw_bottom_line = draw_bottom_line
        self.__all_lines_visible = False

    @property
    def draw_left_line(self):
        return self.__draw_left_line

    @draw_left_line.setter
    def draw_left_line(self, draw_left_line):
        self.__draw_left_line = draw_left_line
        self.__all_lines_visible = False


    def debug(self, indent):
        print("{0}rectangle {1} y-center ={2}".format(indent, self.name, self.y_center))
        indent = indent + "    "
        # self.top_left_point.debug(indent)
        # self.bottom_left_point.debug(indent)
        # self.bottom_right_point.debug(indent)

    def apply_background_color(self, pdf_object):
        pdf_object.setFillColorRGB(
            self.back_ground_color.red / 255,
            self.back_ground_color.green / 255,
            self.back_ground_color.blue / 255
        )

    def draw(self, pdf_object, print_level=0):
        fill_rect = 0
        pdf_object.setLineWidth(self.line_width)

        if (self.back_ground_color):
            self.apply_background_color(pdf_object)
            fill_rect = 1

        if self.__all_lines_visible:
            pdf_object.rect(
                self.bottom_left_point.x,
                self.bottom_left_point.y,
                self.width,
                self.height,
                fill=fill_rect
            )
        else:
            if (self.back_ground_color):
                pdf_object.rect(
                    self.bottom_left_point.x,
                    self.bottom_left_point.y,
                    self.width,
                    self.height,
                    stroke=0,
                    fill=fill_rect
                )

            if self.__draw_bottom_line:
                pdf_object.line(
                    self.bottom_left_point.x,
                    self.bottom_left_point.y,
                    self.bottom_right_point.x,
                    self.bottom_right_point.y
                )

            if self.__draw_right_line:
                pdf_object.line(
                    self.top_right_point.x,
                    self.top_right_point.y,
                    self.bottom_right_point.x,
                    self.bottom_right_point.y
                )

            if self.__draw_left_line:
                pdf_object.line(
                    self.top_left_point.x,
                    self.top_left_point.y,
                    self.bottom_left_point.x,
                    self.bottom_left_point.y
                )

            if self.__draw_top_line:
                pdf_object.line(
                    self.top_left_point.x,
                    self.top_left_point.y,
                    self.top_right_point.x,
                    self.top_right_point.y
                )

        print_level = max(self.print_level, print_level)


    def get_text_line_from_top(self, margin, height, style, padding=0):
        text_line = Text_Line(
            self.top_left_point.x,
            self.top_left_point.y + margin,
            self.width,
            height,
            style,
            padding
        )
        return text_line


class Text_Area:
    def __init__(self, x, y, width, height, style, alignment=Alignment.LEFT, print_level=0):
        self.x = x
        self.y = y
        self.style = style
        self.width = width
        self.height = height
        self.alignment = alignment
        self.padding_top = 0
        self.padding_left = 0
        self.padding_right = 0
        self.padding_bottom = 0
        self.write_functions = {
            Alignment.LEFT: self.write_left_alignment,
            Alignment.CENTER: self.write_center_alignment,
            Alignment.RIGHT: self.write_right_alignment
        }
        self.bounding_rect = Rectangle(
            x=self.x,
            y=self.y,
            width=self.width,
            height=self.height,
            name='Bounding Rect for Text Area'
        )
        self.text_y = self.get_centered_y_position()
        self.print_level = print_level

    def get_centered_y_position(self):
        return self.bounding_rect.y_center - (self.style.font_height / 2)

    def write_right_alignment(self, pdf_object, text):
        x_pos = self.x + self.width - self.padding_right
        pdf_object.drawRightString(x_pos, self.text_y, text)

    def write_center_alignment(self, pdf_object, text):
        x_pos = self.x + (self.width / 2)
        pdf_object.drawCentredString(x_pos, self.text_y, text)

    def write_left_alignment(self, pdf_object, text):
        x_pos = self.x + self.padding_left
        pdf_object.drawString(x_pos, self.text_y, text)

    def write_text(self, pdf_object, text):
        if text is not None and self.print_level >= DEBUG_PRINT_LEVEL:
            self.style.apply_style(pdf_object)
            self.write_functions[self.alignment](pdf_object, text)

    def draw_image(self, pdf_object, image_file, image_size):
        x_pos = self.bounding_rect.x_center - (image_size / 2)
        y_pos = self.bounding_rect.top_left_point.y - image_size - 2
        print (settings.BASE_DIR + image_file)
        pdf_object.drawImage(settings.BASE_DIR + image_file, x_pos, y_pos, image_size, image_size)

    def draw_rect(self, pdf_object, print_level=0):
        self.bounding_rect.draw(pdf_object, print_level)

    def debug(self, indent=""):
        print("{0}Text Area data".format(indent))
        print("{0} x = {1}, y = {2}, width = {3}, heigth = {4}".format(indent, self.x, self.y, self.width, self.height))
        print("{0} y text = {1}".format(indent, self.text_y))
        self.bounding_rect.debug(indent + "    ")


class Text_Line:
    def __init__(self, x, y, width, height, style, padding=0, print_level=0):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.style = style
        self.padding_top = padding
        self.padding_left = padding
        self.padding_right = padding
        self.padding_bottom = padding
        self.__padding = padding
        self.print_level = print_level
        self.bounding_rect = Rectangle(
            x=self.x,
            y=self.y,
            width=self.width,
            height=self.height
        )
        self.text_y = self.get_centered_y_position()

    @property
    def padding(self):
        return self.__padding

    @padding.setter
    def padding(self, padding):
        self.padding_bottom = padding
        self.padding_left = padding
        self.padding_right = padding
        self.padding_bottom = padding
        self.__padding = padding

    def get_centered_y_position(self):
        return self.bounding_rect.y_center - (self.style.font_height / 2)

    def get_next_line(self):
        next_line = Text_Line(
            self.x,
            self.y - self.height,
            self.width,
            self.height,
            self.style,
            self.padding
        )
        next_line.padding_left = self.padding_left
        next_line.padding_right = self.padding_right
        next_line.padding_top = self.padding_top
        next_line.padding_bottom = self.padding_bottom
        return next_line 

    def get_text_area_by_position(self, x1, x2, alignment=Alignment.LEFT):
        width = abs(x2 - x1)
        text_area = Text_Area(x1, self.y, width, self.height, self.style, alignment)
        text_area.padding_bottom = self.padding_bottom
        text_area.padding_right = self.padding_right
        text_area.padding_left = self.padding_left
        text_area.padding_top = self.padding_top
        return text_area

    def get_text_area_by_width(self, *args, **kwargs):
        if 'previous_text_area' in kwargs:
            previous_text_area = kwargs.get('previous_text_area')
            x = previous_text_area.bounding_rect.bottom_right_point.x
        else:
            x = kwargs.get('x', self.x)

        width = kwargs.get('width', self.width)
        alignment = kwargs.get('alignment', Alignment.LEFT)

        text_area = Text_Area(x, self.y, width, self.height, self.style, alignment)
        text_area.padding_bottom = self.padding_bottom
        text_area.padding_right = self.padding_right
        text_area.padding_left = self.padding_left
        text_area.padding_top = self.padding_top
        return text_area

    def write_text(self, pdf_object, margin, text):
        self.style.apply_style(pdf_object)
        x_pos = self.x + margin
        if self.print_level >= DEBUG_PRINT_LEVEL:
            pdf_object.drawString(x_pos, self.text_y, text)

    def draw_rect(self, pdf_object, print_level=0):
        self.bounding_rect.draw(pdf_object, print_level)


COLOR_BLUE_HEADER = Color(53, 93, 129, alpha=1)
COLOR_GRAY_1 = Color(240, 240, 240, alpha=1)

STYLE_LITTLE_BLUE = Text_Style("Helvetica", 5, COLOR_BLUE_HEADER)
STYLE_TITLE_1 = Text_Style("Helvetica", 20, black)
STYLE_BOLD_TITLE_2 = Text_Style("Helvetica-Bold", 10, black)
STYLE_BOLD_TITLE_1 = Text_Style("Helvetica-Bold", 16, black)
STYLE_DATA_LABEL = Text_Style("Helvetica-Bold", 8, black)
STYLE_PRODUCT_HEADER = Text_Style("Helvetica-Bold", 7, black)
STYLE_PRODUCT_DATA = Text_Style("Helvetica", 8, black)

@login_required
def budget_form(request):
    return render_to_response('budget/budget_form.html')

def drawCenteredRect(pdf_object, width, height):
    x1 = A4_WIDTH / 2 - width / 2
    y1 = A4_HEIGHT / 2 - height / 2
    print("x1 = {0} y1 = {1}".format(x1, y1))
    pdf_object.rect(x1, y1, width, height)

def drawCenteredImage(pdf_object, image_file):
    im = Image.open(image_file)
    width, height = im.size
    x1 = A4_WIDTH / 2 - width / 2
    y1 = A4_HEIGHT / 2 - height / 2
    pdf_object.drawImage(image_file, x1, y1)

def setGrayBackGround(pdf_object):
    pdf_object.setFillColorRGB(240 / 255, 240 / 255, 240 / 255)

def getFontHeight(font_name, font_size):
    face = pdfmetrics.getFont(font_name).face
    ascent = (face.ascent * font_size) / 1000.0
    descent = (face.descent * font_size) / 1000.0
    height = ascent + abs(descent)
    return height

def drawHeader(pdf_object, topLeftX, topLeftY, bottomRightX, bottomRightY, budget):
    LEFT_MARGIN = 10
    TOP_MARGIN = 10
    TEXT_H = 10
    BUDGET_TOP_MARGIN = 30
    PRODUCT_DETAIL_H = 500

    # Draw Header section line division
    x1 = topLeftX
    y1 = topLeftY - HEADER_H
    x2 = bottomRightX
    y2 = topLeftY - HEADER_H
    width_area = bottomRightX - topLeftX

    header_rectangle = Rectangle(
        x=topLeftX,
        y=topLeftY,
        x2=x2,
        y2=y2,
        name="Header"
    )

    pdf_object.line(x1, y1, x2, y2)
    water_mark = settings.MEDIA_ROOT + '/argentalBW.gif'
    drawCenteredImage(pdf_object, water_mark)

    logo = settings.MEDIA_ROOT + '/ARGENTAL_HORIZONTAL2.png'
    im = Image.open(logo)
    logo_width, logo_height = im.size

    pdf_object.drawImage(logo, x1 + LEFT_MARGIN, topLeftY - 22 - TOP_MARGIN, 110, 22)

    #Draw central line
    x_center = header_rectangle.x_center
    line_y1 = topLeftY - 60
    pdf_object.line(x_center, line_y1, x_center, topLeftY - HEADER_H)

    #Set Original
    STYLE_BOLD_TITLE_2.apply_style(pdf_object)
    pdf_object.drawCentredString(x_center, topLeftY - 20, 'ORIGINAL')

    #Draw the X in the central rounded rectangle
    central_rect_w = 30
    central_rect_half_w = central_rect_w / 2
    round_rect_y1 = line_y1 # - central_rect_w
    pdf_object.roundRect(
        x_center - central_rect_half_w,
        round_rect_y1,
        central_rect_w,
        central_rect_w, 5
    )
    # pdf_object.setFont("Helvetica-Bold", 16)
    STYLE_BOLD_TITLE_1.apply_style(pdf_object)
    pdf_object.drawCentredString(x_center, round_rect_y1 + 10, 'X')

    #Draw Right Side Budget Header
    right_side_center_x = x_center + (bottomRightX - x_center) / 2
    STYLE_TITLE_1.apply_style(pdf_object)
    pdf_object.drawCentredString(right_side_center_x, topLeftY - BUDGET_TOP_MARGIN, 'PRESUPUESTO')

    #Draw Date and Vendor Table
    DATE_VENDOR_TABLE_W = 160
    DATE_VENDOR_TABLE_H = 40
    date_vendor_table_y = topLeftY - BUDGET_TOP_MARGIN - DATE_VENDOR_TABLE_H - 10
    date_vendor_table_x = right_side_center_x - (DATE_VENDOR_TABLE_W / 2)
    setGrayBackGround(pdf_object)
    pdf_object.rect(date_vendor_table_x, date_vendor_table_y, DATE_VENDOR_TABLE_W, DATE_VENDOR_TABLE_H, fill=1)
    date_vendor_divisor_y = date_vendor_table_y + DATE_VENDOR_TABLE_H / 2
    pdf_object.line(date_vendor_table_x, date_vendor_divisor_y, date_vendor_table_x + DATE_VENDOR_TABLE_W, date_vendor_divisor_y)
    DATE_VENDOR_TABLE_HORIZONTAL_MARGIN_X = 70 
    date_vendor_table_horizontal_x = date_vendor_table_x + DATE_VENDOR_TABLE_HORIZONTAL_MARGIN_X
    pdf_object.line(date_vendor_table_horizontal_x, date_vendor_table_y, date_vendor_table_horizontal_x, date_vendor_table_y + DATE_VENDOR_TABLE_H)
    STYLE_DATA_LABEL.apply_style(pdf_object)
    font_h = STYLE_DATA_LABEL.font_height
    
    #Date line
    distance_to_center_y = (date_vendor_divisor_y - date_vendor_table_y) / 2 - font_h / 2
    
    date_line_y = date_vendor_divisor_y + distance_to_center_y
    pdf_object.drawRightString(date_vendor_table_horizontal_x - LEFT_MARGIN / 2, date_line_y, "Fecha:")
    formatted_date_str = budget.date.strftime('%d %b %Y')
    pdf_object.drawString(date_vendor_table_horizontal_x + LEFT_MARGIN / 2, date_line_y, formatted_date_str)

    #Seller Line
    date_line_y = date_vendor_divisor_y - distance_to_center_y - font_h
    pdf_object.drawRightString(date_vendor_table_horizontal_x - LEFT_MARGIN / 2, date_line_y, "Vendedor:")
    pdf_object.drawString(date_vendor_table_horizontal_x + LEFT_MARGIN / 2, date_line_y, "Argencas SRL")

    #Draw Header Text
    y_text = topLeftY - TOP_MARGIN - 22 - TEXT_H
    header_line_1 = Text_Line(topLeftX, y_text, width_area, TEXT_H, STYLE_LITTLE_BLUE, LEFT_MARGIN)
    header_line_1.write_text(pdf_object, LEFT_MARGIN, HEADER_LINE_1)

    header_line_2 = header_line_1.get_next_line()
    header_line_2.write_text(pdf_object, LEFT_MARGIN, HEADER_LINE_2)

    header_line_3 = header_line_2.get_next_line()
    header_line_3.write_text(pdf_object, LEFT_MARGIN, HEADER_LINE_3)

    header_line_4 = header_line_3.get_next_line()
    header_line_4.write_text(pdf_object, LEFT_MARGIN, HEADER_LINE_EMAIL)
    header_line_4_cuit = header_line_4.get_text_area_by_position(
        header_line_4.x,
        x_center,
        Alignment.RIGHT
    )
    header_line_4_cuit.write_text(pdf_object, HEADER_LINE_CUIT)

    header_line_5 = header_line_4.get_next_line()
    header_line_5.write_text(pdf_object, LEFT_MARGIN, HEADER_LINE_WEB)
    header_line_iva = header_line_5.get_text_area_by_position(
        header_line_5.x,
        x_center,
        Alignment.RIGHT
    )
    header_line_iva.write_text(pdf_object, HEADER_LINE_IVA)

    # Draw the section that contains all the client data
    data_section_y = header_line_5.get_next_line().y - 10
    data_section_y2 = topLeftY - HEADER_H

    draw_header_data_section(
        pdf_object,
        topLeftX,
        data_section_y,
        bottomRightX,
        data_section_y2,
        budget
    )

    product_detail_top_left_x = topLeftX
    product_detail_top_left_y = data_section_y2
    product_detail_bottom_right_x = bottomRightX
    product_detail_bottom_right_y = data_section_y2 - PRODUCT_DETAIL_H

    product_detail_section(
        pdf_object,
        product_detail_top_left_x,
        product_detail_top_left_y,
        product_detail_bottom_right_x,
        product_detail_bottom_right_y,
        budget
    )

    footer_top_left_x = topLeftX
    footer_top_left_y = product_detail_bottom_right_y
    footer_bottom_right_x = bottomRightX
    footer_bottom_right_y = bottomRightY

    footer_section(
        pdf_object,
        footer_top_left_x,
        footer_top_left_y,
        footer_bottom_right_x,
        footer_bottom_right_y,
        budget
    )


def draw_header_data_section(
        pdf_object,
        top_left_x,
        data_section_y,
        bottom_right_x,
        data_section_y2,
        budget
):
    HEADER_LINE_H = 12
    LEFT_LABEL_WIDTH = 60
    RIGHT_LABEL_WIDTH = 95

    x_center = top_left_x + ( bottom_right_x - top_left_x ) / 2

    header_data_rect = Rectangle(
        x=top_left_x,
        y=data_section_y,
        x2=bottom_right_x,
        y2=data_section_y2,
        name='Header Data Section',
        draw_top_line=True,
        draw_left_line=True,
        draw_right_line=True,
        back_ground_color=COLOR_GRAY_1
    )

    header_data_rect.draw(pdf_object)
    data_line_1 = header_data_rect.get_text_line_from_top(0, HEADER_LINE_H, STYLE_DATA_LABEL)
    data_line_1.bounding_rect.draw_bottom_line = True
    data_line_1.draw_rect(pdf_object)
    data_line_1.padding_left = 3
    data_line_1.padding_right = 3

    client_label = data_line_1.get_text_area_by_width(width=LEFT_LABEL_WIDTH, alignment=Alignment.RIGHT)
    client_label.print_level = 1
    client_label.write_text(pdf_object, "CLIENTE:")
    client_label.bounding_rect.draw_right_line = True
    client_label.bounding_rect.draw(pdf_object)

    data_section_width = x_center - top_left_x - LEFT_LABEL_WIDTH

    client_data = data_line_1.get_text_area_by_width(
        previous_text_area=client_label,
        width=data_section_width
    )
    client_data.write_text(pdf_object, budget.client.name)
    client_data.bounding_rect.draw_right_line = True
    client_data.bounding_rect.draw(pdf_object)

    phone_label = data_line_1.get_text_area_by_width(
        previous_text_area=client_data,
        width=RIGHT_LABEL_WIDTH,
        alignment=Alignment.RIGHT
    )
    phone_label.write_text(pdf_object, "TELEFONO:")
    phone_label.bounding_rect.draw_right_line = True
    phone_label.bounding_rect.draw(pdf_object)

    phone_data = data_line_1.get_text_area_by_width(
        previous_text_area=phone_label,
        width=data_section_width
    )

    data_line_2 = data_line_1.get_next_line()
    data_line_2.bounding_rect.draw_bottom_line = True
    data_line_2.draw_rect(pdf_object)
    nit_label = data_line_2.get_text_area_by_width(width=LEFT_LABEL_WIDTH, alignment=Alignment.RIGHT)
    nit_label.write_text(pdf_object, "NIT/CI:")
    nit_label.bounding_rect.draw_right_line = True
    nit_label.bounding_rect.draw(pdf_object)

    nit_data = data_line_2.get_text_area_by_width(
        previous_text_area=nit_label,
        width=data_section_width
    )
    nit_data.write_text(pdf_object, budget.client.nit)
    nit_data.bounding_rect.draw_right_line = True
    nit_data.bounding_rect.draw(pdf_object)

    payment_term_label = data_line_2.get_text_area_by_width(
        previous_text_area=nit_data,
        width=RIGHT_LABEL_WIDTH,
        alignment=Alignment.RIGHT
    )
    payment_term_label.write_text(pdf_object, "FORMA DE PAGO:")
    payment_term_label.bounding_rect.draw_right_line = True
    payment_term_label.bounding_rect.draw(pdf_object)

    payment_term_data = data_line_2.get_text_area_by_width(
        previous_text_area=payment_term_label,
        width=data_section_width
    )
    print(budget.paymentTerm)
    if (budget.paymentTerm):
        payment_term_data.write_text(pdf_object, budget.paymentTerm.name)


    #line 3
    data_line_3 = data_line_2.get_next_line()
    data_line_3.bounding_rect.draw_bottom_line = True
    data_line_3.draw_rect(pdf_object)
    address_label = data_line_3.get_text_area_by_width(
        width=LEFT_LABEL_WIDTH,
        alignment=Alignment.RIGHT
    )
    address_label.write_text(pdf_object, "DIRECCIÓN:")
    address_label.bounding_rect.draw_right_line = True
    address_label.bounding_rect.draw(pdf_object)

    address_data = data_line_3.get_text_area_by_width(
        previous_text_area=address_label,
        width=data_section_width
    )
    if budget.delivery_address is not None:
        address_data.write_text(pdf_object, budget.delivery_address.address)
    address_data.bounding_rect.draw_right_line = True
    address_data.bounding_rect.draw(pdf_object)

    delivery_address_label = data_line_3.get_text_area_by_width(
        previous_text_area=address_data,
        width=RIGHT_LABEL_WIDTH,
        alignment=Alignment.RIGHT
    )
    delivery_address_label.write_text(pdf_object, "LUGAR DE ENTREGA:")
    delivery_address_label.bounding_rect.draw_right_line = True
    delivery_address_label.bounding_rect.draw(pdf_object)

    delivery_address_data = data_line_3.get_text_area_by_width(
        previous_text_area=delivery_address_label,
        width=data_section_width,
    )
    delivery_address_data.write_text(pdf_object, budget.delivery_city.name)

    #Line 4
    data_line_4 = data_line_3.get_next_line()
    city_label = data_line_4.get_text_area_by_width(
        width=LEFT_LABEL_WIDTH,
        alignment=Alignment.RIGHT
    )
    city_label.write_text(pdf_object, "CIUDAD:")
    city_label.bounding_rect.draw_right_line = True
    city_label.bounding_rect.draw(pdf_object)

    city_data = data_line_4.get_text_area_by_width(
        previous_text_area=city_label,
        width=data_section_width
    )
    if (budget.delivery_address and budget.delivery_address.city):
        city_data.write_text(pdf_object, budget.delivery_address.city.name)
    city_data.bounding_rect.draw_right_line = True
    city_data.bounding_rect.draw(pdf_object)

    proforma_label = data_line_4.get_text_area_by_width(
        previous_text_area=city_data,
        width=RIGHT_LABEL_WIDTH,
        alignment=Alignment.RIGHT
    )
    proforma_label.write_text(pdf_object, "PROFORMA N°:")
    proforma_label.bounding_rect.draw_right_line = True
    proforma_label.bounding_rect.draw(pdf_object)

    proforma_data = data_line_4.get_text_area_by_width(
        previous_text_area=proforma_label,
        width=data_section_width
    )
    proforma_data.write_text(pdf_object, budget.number)


def product_detail_section(
        pdf_object,
        top_left_x,
        top_left_y,
        bottom_right_x,
        bottom_right_y,
        budget
):
    HEADER_LINE_H = 30
    QUANTITY_WIDTH = 50
    PRODUCT_WIDTH = 295
    IMAGE_WIDTH = 65
    UNIT_PRICE_WIDTH = 65
    TOTAL_PRICE_WIDTH = 65

    product_detail_header = Rectangle(
        x=top_left_x,
        y=top_left_y,
        x2=bottom_right_x,
        y2=bottom_right_y,
        name='Product Detail Section',
        draw_top_line=False,
        draw_left_line=False,
        draw_right_line=False,
        draw_bottom_line=False
    )

    header_line = product_detail_header.get_text_line_from_top(0, HEADER_LINE_H, STYLE_PRODUCT_HEADER)
    header_line.bounding_rect.draw_bottom_line = True
    header_line.draw_rect(pdf_object)
    header_line.padding_left = 3
    header_line.padding_right = 3

    quantity_label = header_line.get_text_area_by_width(width=QUANTITY_WIDTH, alignment=Alignment.CENTER)
    quantity_label.write_text(pdf_object, "CANTIDAD")

    # quantity line
    pdf_object.line(
        quantity_label.bounding_rect.top_right_point.x,
        top_left_y,
        quantity_label.bounding_rect.top_right_point.x,
        bottom_right_y
    )

    product_label = header_line.get_text_area_by_width(
        previous_text_area=quantity_label,
        width=PRODUCT_WIDTH,
        alignment=Alignment.CENTER
    )
    product_label.write_text(pdf_object, "PRODUCTO")

    # product line
    pdf_object.line(
        product_label.bounding_rect.top_right_point.x,
        top_left_y,
        product_label.bounding_rect.top_right_point.x,
        bottom_right_y
    )

    # Image Label
    image_label = header_line.get_text_area_by_width(
        previous_text_area=product_label,
        width=IMAGE_WIDTH,
        alignment=Alignment.CENTER
    )
    image_label.write_text(pdf_object, "IMAGEN")

    # Image line
    pdf_object.line(
        image_label.bounding_rect.top_right_point.x,
        top_left_y,
        image_label.bounding_rect.top_right_point.x,
        bottom_right_y
    )

    # Unit Price
    unit_price_label = header_line.get_text_area_by_width(
        previous_text_area=image_label,
        width=UNIT_PRICE_WIDTH,
        alignment=Alignment.CENTER
    )
    unit_price_label.write_text(pdf_object, "PRECIO UNITARIO")

    # Unit price line
    pdf_object.line(
        unit_price_label.bounding_rect.top_right_point.x,
        top_left_y,
        unit_price_label.bounding_rect.top_right_point.x,
        bottom_right_y
    )

    # Total Price
    total_price_label = header_line.get_text_area_by_width(
        previous_text_area=unit_price_label,
        width=TOTAL_PRICE_WIDTH,
        alignment=Alignment.CENTER
    )
    total_price_label.write_text(pdf_object, "PRECIO TOTAL")

    # ----------------------------------------------------------------------
    # Product Detail
    # ----------------------------------------------------------------------

    quantity_data_line = header_line.get_next_line() 

    for budget_detail in budget.budgetdetail_set.all():
        quantity_data = quantity_data_line.get_text_area_by_width(width=QUANTITY_WIDTH, alignment=Alignment.CENTER)
        quantity_data.write_text(pdf_object, "{}".format(budget_detail.quantity))

        product_data = quantity_data_line.get_text_area_by_width(
            previous_text_area=quantity_data,
            width=PRODUCT_WIDTH,
            alignment=Alignment.LEFT
        )
        product_data.write_text(pdf_object, budget_detail.product.description)

        # Image Data
        image_data = quantity_data_line.get_text_area_by_width(
            previous_text_area=product_data,
            width=IMAGE_WIDTH,
            alignment=Alignment.CENTER
        )
        # image_data.write_text(pdf_object, "IMAGEN")
        image_data.draw_image(pdf_object, budget_detail.product.get_photo().url, HEADER_LINE_H)


        # Unit Price
        unit_price_data = quantity_data_line.get_text_area_by_width(
            previous_text_area=image_data,
            width=UNIT_PRICE_WIDTH,
            alignment=Alignment.CENTER
        )
        unit_price_data.write_text(pdf_object, f'US$ {budget_detail.product.wholesale_price:n}')

        # Total Price
        total_price_data = quantity_data_line.get_text_area_by_width(
            previous_text_area=unit_price_data,
            width=TOTAL_PRICE_WIDTH,
            alignment=Alignment.CENTER
        )
        total_price_data.write_text(pdf_object, f'US$ {budget_detail.product.wholesale_price * budget_detail.quantity:n}')

        quantity_data_line = quantity_data_line.get_next_line() 
       

def footer_section(
        pdf_object,
        top_left_x,
        top_left_y,
        bottom_right_x,
        bottom_right_y,
        budget
):
    FOOTER_LINE_H = 15
    DUMMY_1_W = 80
    ADVANCE_PAYMENT_W = 50
    ADVANCE_PAYMENT_DATA_W = 60
    DUMMY_2_W = 90
    SALDO_W = 70
    SALDO_DATA_W = 60
    TOTAL_PRICE_W = 70
    TOTAL_PRICE_DATA_W = 60

    footer = Rectangle(
        x=top_left_x,
        y=top_left_y,
        x2=bottom_right_x,
        y2=bottom_right_y,
        name='Footer',
        draw_top_line=True,
        draw_left_line=False,
        draw_right_line=True,
        draw_bottom_line=False,
        back_ground_color=COLOR_GRAY_1
    )
    footer.draw(pdf_object)
    footer_line_1 = footer.get_text_line_from_top(0, FOOTER_LINE_H, STYLE_PRODUCT_HEADER)
    footer_line_1.padding_left = 3
    footer_line_1.padding_right = 3

    dummy = footer_line_1.get_text_area_by_width(width=DUMMY_1_W, alignment=Alignment.CENTER)
    advanced_payment_label = footer_line_1.get_text_area_by_width(
        previous_text_area=dummy,
        width=ADVANCE_PAYMENT_W,
        alignment=Alignment.RIGHT
    )
    advanced_payment_label.write_text(pdf_object, "ANTICIPO:")
    advanced_payment_label.bounding_rect.draw_left_line = True
    advanced_payment_label.bounding_rect.draw_bottom_line = True
    advanced_payment_label.bounding_rect.draw(pdf_object)

    advanced_payment_data = footer_line_1.get_text_area_by_width(
        previous_text_area=advanced_payment_label,
        width=ADVANCE_PAYMENT_DATA_W,
        alignment=Alignment.LEFT
    )
    advanced_payment_data.write_text(pdf_object, "123")
    advanced_payment_data.bounding_rect.draw_right_line = True
    advanced_payment_data.bounding_rect.draw_bottom_line = True
    advanced_payment_data.bounding_rect.draw(pdf_object)

    dummy = footer_line_1.get_text_area_by_width(
        previous_text_area=advanced_payment_data,
        width=DUMMY_2_W,
        alignment=Alignment.CENTER
    )

    saldo_label = footer_line_1.get_text_area_by_width(
        previous_text_area=dummy,
        width=SALDO_W,
        alignment=Alignment.RIGHT
    )
    saldo_label.write_text(pdf_object, "SALDO:")
    saldo_label.bounding_rect.draw_left_line = True
    saldo_label.bounding_rect.draw_bottom_line = True
    saldo_label.bounding_rect.draw(pdf_object)

    saldo_data = footer_line_1.get_text_area_by_width(
        previous_text_area=saldo_label,
        width=SALDO_DATA_W,
        alignment=Alignment.LEFT
    )
    saldo_data.write_text(pdf_object, "123:")
    saldo_data.bounding_rect.draw_right_line = True
    saldo_data.bounding_rect.draw_bottom_line = True
    saldo_data.bounding_rect.draw(pdf_object)

    total_price_label = footer_line_1.get_text_area_by_width(
        previous_text_area=saldo_data,
        width=TOTAL_PRICE_W,
        alignment=Alignment.RIGHT
    )
    total_price_label.write_text(pdf_object, "PRECIO TOTAL:")
    total_price_label.bounding_rect.draw_bottom_line = True
    total_price_label.bounding_rect.draw(pdf_object)

    total_price_data = footer_line_1.get_text_area_by_width(
        previous_text_area=total_price_label,
        width=TOTAL_PRICE_DATA_W,
        alignment=Alignment.LEFT
    )
    total_price_data.write_text(pdf_object, "123:")
    total_price_data.bounding_rect.draw_bottom_line = True
    total_price_data.bounding_rect.draw(pdf_object)

    footer_line_2 = footer_line_1.get_next_line()
    footer_line_2.padding = 3

    commercial_terms_x = footer_line_2.bounding_rect.top_left_point.x
    commercial_terms_y = footer_line_2.bounding_rect.top_left_point.y - 5

    total_width = bottom_right_x - top_left_x

    commercial_terms_area = footer_line_2.get_text_area_by_width(width=total_width, alignment=Alignment.LEFT)
    commercial_terms = pdf_object.beginText()
    commercial_terms.setTextOrigin(
        commercial_terms_area.bounding_rect.top_left_point.x,
        commercial_terms_area.bounding_rect.top_left_point.y - 40
    )
    commercial_terms.setFont("Helvetica", 8)
    commercial_terms.textLines(unquote(budget.commercial_terms))
        
    styleSheet = getSampleStyleSheet()

    style = ParagraphStyle(
        'small',
        fontName='Helvetica',
        fontSize=6,
        leading=8
    )

    str_commercial_terms_to_print = unquote(budget.commercial_terms.replace('%0A', '<br />'))
    commercial_terms_paragraph = Paragraph(str_commercial_terms_to_print, style)
    w,h = commercial_terms_paragraph.wrap(total_width - 10, 1000)
    commercial_terms_paragraph.drawOn(pdf_object, 35, commercial_terms_y - h)
    

def generate_pdf(request, budget_id):
    buffer = io.BytesIO()

    pdf_object = canvas.Canvas(buffer, pagesize=A4)
    canvas_width, canvas_height = A4
    # max real width = 590
    # max real height = 830

    budget = Budget.objects.get(pk=budget_id)

    main_rectangle = Rectangle(
        x=MAIN_RECT_X,
        y=MAIN_RECT_Y,
        width=MAIN_RECT_W,
        height=MAIN_RECT_H,
        name='Main Rectangle'
    )

    # main_rectangle.draw(pdf_object)

    pdf_object.setLineWidth(0.5)
    pdf_object.rect(MAIN_RECT_X, MAIN_RECT_Y, MAIN_RECT_W, MAIN_RECT_H)

    top_left_x = MAIN_RECT_X
    top_left_y = MAIN_RECT_Y + MAIN_RECT_H
    bottom_right_x = MAIN_RECT_X + MAIN_RECT_W
    bottom_right_y = MAIN_RECT_Y

    drawHeader(pdf_object, top_left_x, top_left_y, bottom_right_x, bottom_right_y, budget)

    pdf_object.showPage()
    pdf_object.save()

    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename='newBudget.pdf')